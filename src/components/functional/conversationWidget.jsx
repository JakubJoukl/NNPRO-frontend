import {useFetchCall} from "../../hooks/useFetchCall.js";
import {ConversationUI} from "../visual/ConversationUI.jsx";
import {useContext, useRef} from "react";
import {UserContext} from "../../context/userContext.js";
import {decryptAesKey} from "../helpers/cryptographyHelper.js";

export default function ConversationWidget({coversationId}) {
    const {dtoOut, status, resetErr} = useFetchCall("getConversation", coversationId, null, decryptKey);
    const {userContext, setUserContext} = useContext(UserContext);
    const decryptedKeyRef = useRef(null);

    async function decryptKey(conversation) {
        const currentUserKeyContainer = conversation.users.find(
            (user) => userContext.username === user.username);
        const ivBuffer = new Uint8Array(Object.values(currentUserKeyContainer.iv));

        try {
            decryptedKeyRef.current = await decryptAesKey(
                userContext.privateKey,
                currentUserKeyContainer.cipheringPublicKey,
                currentUserKeyContainer.encryptedSymmetricKey,
                ivBuffer
            )
        }catch (e) {
            console.log(e);
        }
    }

    return <ConversationUI status={status} conversation={dtoOut} reseErr={resetErr}/>
}