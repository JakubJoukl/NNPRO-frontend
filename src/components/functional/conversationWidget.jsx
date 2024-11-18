import {useFetchCall} from "../../hooks/useFetchCall.js";
import {ConversationUI} from "../visual/ConversationUI.jsx";
import {useContext, useRef} from "react";
import {UserContext} from "../../context/userContext.js";
import {decryptAesKey, encryptDataBySymmetricKey} from "../helpers/cryptographyHelper.js";
import {useSubmitCall} from "../../hooks/useSubmitCall.js";
import {useSubscription} from "react-stomp-hooks";

export default function ConversationWidget({coversationId}) {
    const {dtoOut, status, resetErr} = useFetchCall("getConversation", coversationId, null, decryptKey);
    const {status: sendStatus, call} = useSubmitCall("sendMessageToConversation", null, "Failed to send message.");
    const {userContext, setUserContext} = useContext(UserContext);
    const decryptedKeyRef = useRef(null);

    async function decryptKey(conversation) {
        const currentUserKeyContainer = conversation.users.find(
            (user) => userContext.username === user.username);
        const ivBuffer = new Uint8Array(Object.values(currentUserKeyContainer.iv));

        try {
            decryptedKeyRef.current = (await decryptAesKey(
                userContext.privateKey,
                currentUserKeyContainer.cipheringPublicKey,
                currentUserKeyContainer.encryptedSymmetricKey,
                ivBuffer
            )).importedKey;
        } catch (e) {
            console.log(e);
        }
    }

    async function onSendMessage(message) {
        const encrypted = await encryptDataBySymmetricKey(decryptedKeyRef.current, message);
        console.log(encrypted);
        call(encrypted);
    }

    return <ConversationUI status={status} conversation={dtoOut} reseErr={resetErr} sendStatus={sendStatus}
                           onSendMessage={onSendMessage}/>
}