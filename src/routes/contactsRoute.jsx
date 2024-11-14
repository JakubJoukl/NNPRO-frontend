import {ContactsList} from "../components/functional/contactsList.jsx";
import {AddContactsDialog} from "../components/visual/addContactsDialog.jsx";
import {useState} from "react";
import {AddedContactsContext} from "../context/addedContactsContext.js";
import {Typography} from "@mui/material";

export function ContactsRoute() {
    const [addedContacts, setAddedContacts] = useState({});

    return <AddedContactsContext.Provider value={{addedContacts, setAddedContacts}}>
        <div className={"text-center"}>
            <Typography variant="h4" gutterBottom className={"w-full"} textAlign={"center"}>
                Your contacts
            </Typography>
            <AddContactsDialog/>
            <ContactsList deleteEnabled={true}/>
        </div>
    </AddedContactsContext.Provider>
}