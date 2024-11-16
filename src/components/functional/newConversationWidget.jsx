import {useContext, useRef, useState} from "react";
import {ContactsList} from "./contactsList.jsx";
import {CreateConversationFormUI} from "../visual/createConversationFormUI.jsx";
import {useSubmitCall} from "../../hooks/useSubmitCall.js";
import {
    encryptAesKey,
    generateSharedAESKey,
} from "../helpers/cryptographyHelper.js";
import {UserContext} from "../../context/userContext.js";
import {useNavigate} from "react-router-dom";
import {AddedConversationContext} from "../../context/AddedConversationContext.js";

export default function NewConversationWidget({onUserClicked, deleteEnabled}) {
    const [selectedContact, setSelectedContact] = useState(null);
    const {status, call, dtoOut} = useSubmitCall(
        "createConversation", "Conversation has been created successfully",
        "Creating conversation failed due to unknown error."
    );
    const {privateKey, publicKey, username} = useContext(UserContext).userContext;
    const navigate = useNavigate();
    const {setAddedConversation} = useContext(AddedConversationContext);

    async function handleOnSubmit(conversationName) {
        const {aesKey, rawKey} = await generateSharedAESKey();
        const {key, iv} = await encryptAesKey(privateKey, selectedContact.publicKey, rawKey);
        // Also sign for ourselves
        const {key: ownKey, iv: ownIv} = await encryptAesKey(privateKey, publicKey, rawKey);

        call({
            name: conversationName,
            users: [
                {username: selectedContact.username, encryptedSymmetricKey: key, iv, cipheringPublicKey: publicKey},
                {username: username, encryptedSymmetricKey: ownKey, iv: ownIv, cipheringPublicKey: publicKey}
            ]
        }, undefined);
    }


    if (status.callFinished && !status.isError && dtoOut) {

        return navigate(`/conversation/${dtoOut.id}`);
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