import {useContext, useState} from "react";
import {ContactsList} from "./contactsList.jsx";
import {CreateConversationFormUI} from "../visual/createConversationFormUI.jsx";
import {useSubmitCall} from "../../hooks/useSubmitCall.js";
import {
    encryptAesKey,
    generateSharedAESKey,
} from "../helpers/cryptographyHelper.js";
import {UserContext} from "../../context/userContext.js";
import {AddedConversationContext} from "../../context/AddedConversationContext.js";
import {Navigate} from "react-router-dom";

export default function NewConversationWidget({onUserClicked, deleteEnabled}) {
    const [selectedContact, setSelectedContact] = useState(null);
    const {status, call, dtoOut} = useSubmitCall(
        "createConversation", "Conversation has been created successfully",
        "Creating conversation failed due to unknown error.",
        callback
    );
    const {privateKey, publicKey, username} = useContext(UserContext).userContext;
    const {setAddedConversation} = useContext(AddedConversationContext);

    // Need to also add conversation to context
    function callback(callDtoOut) {
        setAddedConversation((prevState) => {
            return [
                ...prevState,
                callDtoOut
            ]
        });
    }


    async function handleOnSubmit(conversationName) {
        const {aesKey, rawKey} = await generateSharedAESKey();
        const {key, iv} = await encryptAesKey(privateKey, selectedContact.publicKey, rawKey);
        // Also sign for ourselves
        const {key: ownKey, iv: ownIv} = await encryptAesKey(privateKey, publicKey, rawKey);

        call({
            name: conversationName,
            users: [
                {
                    username: selectedContact.username,
                    encryptedSymmetricKey: key,
                    iv,
                    cipheringPublicKey: selectedContact.publicKey
                },
                {username: username, encryptedSymmetricKey: ownKey, iv: ownIv, cipheringPublicKey: publicKey}
            ]
        }, undefined);
    }

    if (status.callFinished && !status.isError && dtoOut) {
        return <Navigate to={`/conversation/${dtoOut.id}`} replace/>
    }

    function handleOnUserClicker(contact) {
        setSelectedContact(contact);
    }

    if (!selectedContact) {
        return <ContactsList onUserClicked={handleOnUserClicker}/>
    }
    return <CreateConversationFormUI selectedContact={selectedContact} setSelectedContact={setSelectedContact}
                                     status={status} onSubmit={handleOnSubmit}/>
}