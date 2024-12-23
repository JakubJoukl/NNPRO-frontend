import {DraggableDialog} from "./DraggableDialog.jsx";
import {UsersList} from "../functional/usersList.jsx";
import {Button} from "@mui/material";
import {useContext, useState} from "react";
import * as Calls from "../../constants/calls.js";
import {UserContext} from "../../context/userContext.js";
import {GlobalAlertContext} from "../../context/globalAlertContext.js";
import {AdminWidgetContext} from "../../context/adminWidgetContext.js";
import AuthorizationHelper from "../helpers/authorizationHelper.js";

export function AddAdminDialog() {
    const {setAdmins, adminFilter} = useContext(AdminWidgetContext);
    const {token} = useContext(UserContext).userContext;
    const {openAlert} = useContext(GlobalAlertContext);
    const [addedAdmins, setAddedAdmins] = useState({});

    function handleOnAddAdmin(contact) {
        setAddedAdmins((prevState) => {
            return {
                ...prevState, [contact.username]: {
                    contact, progress: "inProgress"
                }
            }
        });

        Calls.addAdmin({username: contact.username}, null, token).then((_) => {
                openAlert(`Admin "${contact.username}" successfully added.`);
                setAddedAdmins((prevState) => {
                    return {
                        ...prevState, [contact.username]: {
                            contact, progress: "done"
                        }
                    }
                });
                if (contact.username.startsWith(adminFilter)) {
                    setAdmins((prevState) => [...prevState, contact]);
                }
            }
        ).catch((err) => {
            console.log(err);
            openAlert(`Adding of admin "${contact.username}" failed.`, "error");
            setAddedAdmins((prevState) => {
                delete prevState[contact.username];
                return {
                    ...prevState
                }
            });
        });
    }

    return <DraggableDialog title={"Add new administrator"}
                            Content={<UsersList handleOnAddUser={handleOnAddAdmin}
                                                className={"h-128 max-h-screen"}
                                                addedUsers={addedAdmins}
                                                userIsAddedFunction={(user) => AuthorizationHelper.userIsAuthorities(user.claims ?? [])}
                            />}
                            dialogButtonContent={"Add new administrator"}
                            OpenDialogButton={Button}
                            className={"h-128 max-h-screen"}
                            buttonOptions={{variant: "outlined"}}
                            onClose={() => setAddedAdmins({})}
    />
}