import {useState} from "react";
import {ContactsList} from "./contactsList.jsx";
import {CreateConversationFormUI} from "../visual/createConversationFormUI.jsx";
import {useSubmitCall} from "../../hooks/useSubmitCall.js";

export default function NewConversationWidget({onUserClicked, deleteEnabled}) {
    const [selectedContact, setSelectedContact] = useState(null);
    const {status, call} = useSubmitCall(
        "createConversation", "Conversation has been created successfully",
        "Creating conversation failed due to unknown error."
    );

    function handleOnSubmit(conversationName) {
        call({name: conversationName, users: [selectedContact.username]}, undefined);
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