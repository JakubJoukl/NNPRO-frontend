import {Typography} from "@mui/material";
import NewConversationWidget from "../components/functional/newConversationWidget.jsx";
import {useState} from "react";
import {ContactsContext} from "../context/contactsContext.js";

export function NewConversationRoute() {
    const [contacts, setContacts] = useState([]);
    const [contactFilter, setContactFilter] = useState("");
    return <ContactsContext.Provider value={{contacts, setContacts, contactFilter, setContactFilter}}>
        <div className={"text-center flex-col items-center flex flex-grow overflow-auto"}>
            <Typography variant="h4" gutterBottom className={"w-full"} textAlign={"center"}>
                New conversation
            </Typography>
            <NewConversationWidget/>
        </div>
    </ContactsContext.Provider>
}