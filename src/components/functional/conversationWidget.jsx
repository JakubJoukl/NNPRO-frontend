import {useFetchCall} from "../../hooks/useFetchCall.js";
import {ConversationUI} from "../visual/ConversationUI.jsx";
import {useContext, useState} from "react";
import {UserContext} from "../../context/userContext.js";
import {decryptAesKey, encryptDataBySymmetricKey} from "../helpers/cryptographyHelper.js";
import {useSubmitCall} from "../../hooks/useSubmitCall.js";
import {GlobalAlertContext} from "../../context/globalAlertContext.js";

export default function ConversationWidget({conversationId}) {
    const {dtoOut, status, resetErr} = useFetchCall("getConversation", conversationId, null, decryptKey);
    const {userContext, setUserContext} = useContext(UserContext);
    const [decryptedKey, setDecryptedKey] = useState(null);
    const {openAlert} = useContext(GlobalAlertContext);

    async function decryptKey(conversation) {
        const currentUserKeyContainer = conversation.users.find(
            (user) => userContext.username === user.username);
        const ivBuffer = new Uint8Array(Object.values(currentUserKeyContainer.iv));

        try {
            setDecryptedKey((await decryptAesKey(
                userContext.privateKey,
                currentUserKeyContainer.cipheringPublicKey,
                currentUserKeyContainer.encryptedSymmetricKey,
                ivBuffer
            )).importedKey);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async function onSendMessage(stompClient, message) {
        try {
            const {encryptedData, iv} = await encryptDataBySymmetricKey(decryptedKey, message);
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
        }catch (e) {
            openAlert("Sending of message failed.", "error")
        }
    }

    return <ConversationUI status={status} conversation={dtoOut} reseErr={resetErr} onSendMessage={onSendMessage} conversationId={conversationId} decryptedKey={decryptedKey}/>
}