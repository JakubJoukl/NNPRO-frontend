import {DraggableDialog} from "./DraggableDialog.jsx";
import {UsersList} from "../functional/usersList.jsx";
import {Button} from "@mui/material";
import {useContext, useState} from "react";
import * as Calls from "../../constants/calls.js";
import {UserContext} from "../../context/userContext.js";
import {GlobalAlertContext} from "../../context/globalAlertContext.js";
import {ContactsContext} from "../../context/contactsContext.js";

export function AddContactsDialog() {
    const {setContacts, contactFilter} = useContext(ContactsContext);
    const {token} = useContext(UserContext).userContext;
    const {openAlert} = useContext(GlobalAlertContext);
    const [addedContacts, setAddedContacts] = useState({});

    function handleOnAddContact(contact) {
        setAddedContacts((prevState) => {
            return {
                ...prevState, [contact.username]: {
                    contact, progress: "inProgress"
                }
            }
        });

        Calls.addContact({username: contact.username}, null, token).then((_) => {
                openAlert(`Contact "${contact.username}" successfully added.`);
                setAddedContacts((prevState) => {
                    return {
                        ...prevState, [contact.username]: {
                            contact, progress: "done"
                        }
                    }
                });
                if (contact.username.startsWith(contactFilter)) {
                    setContacts((prevState) => [...prevState, contact]);
                }
            }
        ).catch((err) => {
            console.log(err);
            openAlert(`Addidng of contact "${contact.username}" failed.`, "error");
            setAddedContacts((prevState) => {
                delete prevState[contact.username];
                return {
                    ...prevState
                }
            });
        });
    }

    return <DraggableDialog title={"Add new contact"}
                            Content={<UsersList handleOnAddContact={handleOnAddContact}
                                                className={"h-128 max-h-screen"}
                                                addedContacts={addedContacts}
                            />}
                            dialogButtonContent={"Add new contact"}
                            OpenDialogButton={Button} className={"h-128 max-h-screen"}
                            buttonOptions={{variant: "outlined"}}
    />
}