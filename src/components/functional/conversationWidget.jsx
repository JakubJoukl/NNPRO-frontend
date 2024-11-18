import {useFetchCall} from "../../hooks/useFetchCall.js";
import {ConversationUI} from "../visual/ConversationUI.jsx";
import {useContext, useState} from "react";
import {UserContext} from "../../context/userContext.js";
import {decryptAesKey, encryptDataBySymmetricKey} from "../helpers/cryptographyHelper.js";
import {useSubmitCall} from "../../hooks/useSubmitCall.js";

export default function ConversationWidget({conversationId}) {
    const {dtoOut, status, resetErr} = useFetchCall("getConversation", conversationId, null, decryptKey);
    const {userContext, setUserContext} = useContext(UserContext);
    const [decryptedKey, setDecryptedKey] = useState(null);

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
        }
    }

    async function onSendMessage(stompClient, message) {
        const {encryptedData, iv} = await encryptDataBySymmetricKey(decryptedKey, message);
        console.log("Stompity stompy stomp womp womp!");
        //Send Message
        stompClient.publish({
            destination: "/app/sendMessageToConversation",
            body: JSON.stringify({
                conversationId,
                sender: userContext.username,
                message: encryptedData,
                iv
            }),
        });
    }

    return <ConversationUI status={status} conversation={dtoOut} reseErr={resetErr} onSendMessage={onSendMessage}/>
}