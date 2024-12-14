import {ContactsList} from "../components/functional/contactsList.jsx";
import {AddContactsDialog} from "../components/visual/addContactsDialog.jsx";
import {useState} from "react";
import {ContactsContext} from "../context/contactsContext.js";
import {Typography} from "@mui/material";

export function ContactsRoute() {
    const [contacts, setContacts] = useState([]);
    const [contactFilter, setContactFilter] = useState("");

    return <ContactsContext.Provider value={{contacts, setContacts, contactFilter, setContactFilter}}>
        <div className={"text-center p-3"}>
            <Typography variant="h4" gutterBottom className={"w-full"} textAlign={"center"}>
                Your contacts
            </Typography>
            <AddContactsDialog/>
            <ContactsList deleteEnabled={true}/>
        </div>
    </ContactsContext.Provider>
}