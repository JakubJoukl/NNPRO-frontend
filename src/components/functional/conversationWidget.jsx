import {useFetchCall} from "../../hooks/useFetchCall.js";
import {ConversationUI} from "../visual/ConversationUI.jsx";
import {useContext, useRef, useState} from "react";
import {UserContext} from "../../context/userContext.js";
import {decryptAesKey, encryptDataBySymmetricKey} from "../helpers/cryptographyHelper.js";
import {GlobalAlertContext} from "../../context/globalAlertContext.js";
import {useSubmitCall} from "../../hooks/useSubmitCall.js";

export default function ConversationWidget({conversationId}) {
    const {dtoOut, status, resetErr} = useFetchCall("getConversation", conversationId, null, decryptKey);
    const {call} = useSubmitCall('deleteMessage', "Message deleted.", "Deleting of message failed.");
    const {userContext, setUserContext} = useContext(UserContext);
    const [decryptedKey, setDecryptedKey] = useState({});
    const {openAlert} = useContext(GlobalAlertContext);
    const currentPrivateKeyRef = useRef(userContext.privateKey);
    if (currentPrivateKeyRef.current !== userContext.privateKey) {
        decryptKey(dtoOut);
    }

    async function decryptKey(conversation) {
        currentPrivateKeyRef.current = userContext.privateKey;
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
            setDecryptedKey(aesKey);
        } catch (e) {
            openAlert("Decrypting of private key failed!", "error");
            setDecryptedKey({});
        }
    }

    async function onSendMessage(stompClient, message) {
        try {
            const {encryptedData, iv} = await encryptDataBySymmetricKey(decryptedKey.importedKey, message);
            //Send Message
            console.log("Stomp send!");
            stompClient.publish({
                destination: "/app/sendMessageToConversation",
                body: JSON.stringify({
                    conversationId,
                    sender: userContext.username,
                    message: encryptedData,
                    iv
                }),
            });
        } catch (e) {
            openAlert("Sending of message failed.", "error")
        }
    }

    function onDeleteMessage(id) {
        console.log(id);
        call({id});
    }

    return <ConversationUI status={status} conversation={dtoOut} reseErr={resetErr} onSendMessage={onSendMessage}
                           conversationId={conversationId} decryptedKey={decryptedKey}
                           onDeleteMessage={onDeleteMessage}/>
}