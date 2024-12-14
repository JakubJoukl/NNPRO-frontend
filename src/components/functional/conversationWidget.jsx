import {useFetchCall} from "../../hooks/useFetchCall.js";
import {ConversationUI} from "../visual/ConversationUI.jsx";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../../context/userContext.js";
import {decryptAesKey, encryptDataBySymmetricKey} from "../helpers/cryptographyHelper.js";
import {GlobalAlertContext} from "../../context/globalAlertContext.js";
import {useSubscription} from "react-stomp-hooks";
import * as Calls from "../../constants/calls.js";

export default function ConversationWidget({conversationId}) {
    const {dtoOut, status, resetErr} = useFetchCall("getConversation", conversationId, null, decryptKey);
    const {userContext} = useContext(UserContext);
    const [decryptedKey, setDecryptedKey] = useState({});
    const {openAlert} = useContext(GlobalAlertContext);
    const [hasBeenDeleted, setHasBeenDeleted] = useState(false);
    const [asyncLoadedConversation, setAsyncLoadedConversation] = useState(null);

    if (decryptedKey.decryptingPrivateKey !== userContext.privateKey) {
        decryptKey(dtoOut);
    }

    useEffect(() => {
        setHasBeenDeleted(false);
        setAsyncLoadedConversation(null);
    }, [conversationId]);

    async function decryptKey(conversation) {
        const currentUserKeyContainer = conversation.users.find(
            (user) => userContext.username === user.username);
        const ivBuffer = new Uint8Array(Object.values(currentUserKeyContainer.iv));

        try {
            const aesKey = (await decryptAesKey(
                userContext.privateKey,
                currentUserKeyContainer.cipheringPublicKey,
                currentUserKeyContainer.encryptedSymmetricKey,
                ivBuffer
            ));
            aesKey.decryptingPrivateKey = userContext.privateKey;
            setDecryptedKey(aesKey);
        } catch (e) {
            openAlert("Decrypting of symmetric key failed!", "error");
            setDecryptedKey({decryptingPrivateKey: userContext.privateKey});
        }
    }

    async function onSendMessage(stompClient, message, additionalParams) {
        try {
            const {encryptedData, iv} = await encryptDataBySymmetricKey(decryptedKey.importedKey, message);
            //Send Message
            console.log("Stomp send!");
            const messageBody = {
                conversationId,
                sender: userContext.username,
                message: encryptedData,
                iv
            };
            if (additionalParams.disapperanceTime) {
                const milliseconds = additionalParams.disapperanceTime * 1000;
                messageBody.validTo = new Date(Date.now() + milliseconds);
            }
            stompClient.publish({
                destination: "/app/sendMessageToConversation",
                body: JSON.stringify(messageBody),
            });
        } catch (e) {
            openAlert("Sending of message failed.", "error")
        }
    }

    useSubscription(`/topic/deleteConversation/${userContext.username}`, async (message) => {
        try {
            const parsedMessage = JSON.parse(message.body);
            if (Number(conversationId) === parsedMessage.id) {
                setHasBeenDeleted(true);
            }
        } catch (e) {
            openAlert("Failed to refresh conversation upon deleting user. Please reload conversation to see changes.");
        }
    });

    useSubscription(`/topic/newUser/${userContext.username}`, async (message) => {
        try {
            const parsedMessage = JSON.parse(message.body);
            if (Number(conversationId) === parsedMessage.conversationId) {
                const conversation = await Calls.getConversation(conversationId, null, userContext.token);
                setAsyncLoadedConversation(conversation);
            }
        } catch (e) {
            openAlert("Failed to refresh conversation upon adding user. Please reload conversation to see new users.");
        }
    });

    useSubscription(`/topic/leaveConversation/${userContext.username}`, async (message) => {
        const parsedMessage = JSON.parse(message.body);
        if (Number(conversationId) === parsedMessage.conversationId) {
            const conversation = await Calls.getConversation(conversationId, null, userContext.token);
            setAsyncLoadedConversation(conversation);
        }
    });

    return <ConversationUI status={status} conversation={asyncLoadedConversation ?? dtoOut} reseErr={resetErr}
                           onSendMessage={onSendMessage}
                           conversationId={conversationId} decryptedKey={decryptedKey} hasBeenDeleted={hasBeenDeleted}/>
}