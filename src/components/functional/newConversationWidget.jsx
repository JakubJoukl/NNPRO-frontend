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
import {FormControlLabel, Switch} from "@mui/material";
import {GroupConversation} from "./GroupConversation.jsx";
import {GlobalAlertContext} from "../../context/globalAlertContext.js";

export default function NewConversationWidget({onUserClicked, deleteEnabled}) {
    const [selectedContact, setSelectedContact] = useState(null);
    const [groupConversation, setGroupConversation] = useState(false);
    const {status, call, dtoOut} = useSubmitCall(
        "createConversation", "Conversation has been created successfully",
        "Creating conversation failed due to unknown error.",
        callback
    );
    const {openAlert} = useContext(GlobalAlertContext);
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

    async function handleOnSubmit(conversationName, selectedContacts) {
        const users = [];
        const {aesKey, rawKey} = await generateSharedAESKey();
        for (const selectedContact of selectedContacts) {
            try {
                const {key, iv} = await encryptAesKey(privateKey, selectedContact.publicKey, rawKey);
                users.push(
                    {
                        username: selectedContact.username,
                        encryptedSymmetricKey: key,
                        iv,
                        cipheringPublicKey: publicKey
                    }
                )
            } catch (e) {
                openAlert(`Creating of conversation failed - ciphering by public key was not successful for user ${selectedContacts.username}`)
                return;
            }
        }
        // Also sign for ourselves
        try {
            const {key: ownKey, iv: ownIv} = await encryptAesKey(privateKey, publicKey, rawKey);
            users.push({username: username, encryptedSymmetricKey: ownKey, iv: ownIv, cipheringPublicKey: publicKey});
        }catch (e) {
            openAlert(`Creating of conversation failed - ciphering by public key was not successful for your key.`)
            return;
        }
        call({
            name: conversationName,
            users
        }, undefined);
    }

    if (status.callFinished && !status.isError && dtoOut) {
        return <Navigate to={`/conversation/${dtoOut.id}`} replace/>
    }

    function handleOnUserClicker(contact) {
        setSelectedContact(contact);
    }

    function renderGroupConversationSwitchButton() {
        return <FormControlLabel
            control={
                <Switch checked={groupConversation} onChange={() => setGroupConversation((prevState) => !prevState)}/>
            }
            label="Group conversation"
        />
    }

    if (!selectedContact && !groupConversation) {
        return <>
            {renderGroupConversationSwitchButton()}
            <ContactsList onUserClicked={handleOnUserClicker}/>
        </>
    }
    return <>
        {renderGroupConversationSwitchButton()}
        {!groupConversation &&
            <CreateConversationFormUI selectedContact={selectedContact} setSelectedContact={setSelectedContact}
                                      status={status} onSubmit={handleOnSubmit}/>}
        {groupConversation && <GroupConversation status={status} onSubmit={handleOnSubmit}/>}
    </>
}