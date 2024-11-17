import {DraggableDialog} from "./DraggableDialog.jsx";
import {UsersList} from "../functional/usersList.jsx";
import {Button} from "@mui/material";
import {useContext} from "react";
import * as Calls from "../../constants/calls.js";
import {UserContext} from "../../context/userContext.js";
import {GlobalAlertContext} from "../../context/globalAlertContext.js";
import {AddedContactsContext} from "../../context/addedContactsContext.js";

export function AddContactsDialog() {
    const {setAddedContacts} = useContext(AddedContactsContext);
    const {token} = useContext(UserContext).userContext;
    const {openAlert} = useContext(GlobalAlertContext);

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
            }
        ).catch((err) => {
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
                                                className={"h-128 max-h-screen"}/>}
                            dialogButtonContent={"Add new contact"}
                            OpenDialogButton={Button} className={"h-128 max-h-screen"}
                            buttonOptions={{variant:"outlined"}}
    />
}