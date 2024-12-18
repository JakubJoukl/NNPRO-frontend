import {useContext, useState} from "react";
import {UserContext} from "../../context/userContext.js";
import {useSubmitCall} from "../../hooks/useSubmitCall.js";
import {RotateSymmetricKeyUI} from "../visual/RotateSymmetricKeyUI.jsx";
import {encryptAesKey, generateSharedAESKey} from "../helpers/cryptographyHelper.js";
import {GlobalAlertContext} from "../../context/globalAlertContext.js";

export function RotateSymmetricKey({conversation, className, decryptedKey, fetchConversation}) {
    const {status, call, dtoOut} = useSubmitCall(
        "rotateKeys", "Symmetric key rotated! In the name of security, I will encrypt you!",
        "Rotation of symmetric key failed due to unknown error.",
        onRotateDone
    );
    const [encryptInProgress, setEncryptInProgress] = useState(false);
    const {userContext} = useContext(UserContext);
    const {openAlert} = useContext(GlobalAlertContext);

    function onRotateDone() {
        setEncryptInProgress(false);
        fetchConversation();
    }

    async function handleOnSubmit() {
        setEncryptInProgress(true);
        const users = [];
        const {aesKey, rawKey} = await generateSharedAESKey();
        for (const participant of conversation.users) {
            try {
                const {key, iv} = await encryptAesKey(userContext.privateKey, participant.cipheringPublicKey, rawKey);
                users.push(
                    {
                        username: participant.username,
                        encryptedSymmetricKey: key,
                        iv,
                        cipheringPublicKey: userContext.publicKey
                    }
                );
            } catch (e) {
                console.log(e);
                openAlert(`Rotation of symmetric key failed due to failed key encryption for user ${participant.username}`,"error")
                return;
            }
        }
        setEncryptInProgress(false);
        call({
            conversationId: conversation.conversationId,
            users
        }, undefined);
    }


    return <RotateSymmetricKeyUI conversation={conversation} className={className} decryptedKey={decryptedKey}
                                 encryptInProgress={encryptInProgress || status.callInProgress} onSubmit={() => handleOnSubmit()}/>
}