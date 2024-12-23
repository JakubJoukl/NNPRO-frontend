import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {Alert, Button, CircularProgress, TextField, Typography} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import {useContext, useRef, useState} from "react";
import {ControlledDraggableDialog} from "./ControlledDraggableDialog.jsx";
import {DeleteContactBody} from "./deleteContactBody.jsx";
import {useSubmitCall} from "../../hooks/useSubmitCall.js";
import {AdminWidgetContext} from "../../context/adminWidgetContext.js";
import {DeleteAdminBody} from "./DeleteAdminBody.jsx";

export function AdminListUI({admins, status, handleOnLoadMore, setFilteredName}) {
    const timeoutRef = useRef();
    const [currentlyDeletedContact, setCurrentlyDeletedContact] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const {status: deleteStatus, call} = useSubmitCall(
        "removeAdmin", "Admin has been removed",
        "Deleting of admin failed",
        handleOnDeleteCallback
    );
    const {setAdmins} = useContext(AdminWidgetContext);

    function handleOnDeleteCallback() {
        setAdmins((prevState) => prevState.filter(user => user.username !== currentlyDeletedContact.username));
        handleCloseDialog();
    }

    function handleCloseDialog() {
        setDeleteDialogOpen(false);
    }

    function onDeleteContact() {
        call({username: currentlyDeletedContact.username}, null)
    }

    //Maybe filtering textfield deserves to be in separate component?
    return (<div className={"w-full flex flex-col items-center"}><List className={"w-full"}>
        <TextField onChange={(e) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            timeoutRef.current = setTimeout(() => {
                setFilteredName(e.target.value);
            }, 500);
        }
        }
                   label={"Username"} variant="filled" className={"w-full"}/>
        {status?.isError && (<>
            <ListItem disablePadding>
                <Alert
                    severity={"error"}
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    Error occurred during loading of administrators.
                </Alert>
            </ListItem>
            <ListItem disablePadding className={"flex !justify-center mt-3 flex-row"}>
                <Button
                    size="large" variant="outlined"
                    onClick={() => {
                        handleOnLoadMore()
                    }
                    }
                    color={"primary"}
                >Reload</Button>
            </ListItem>
        </>)
        }
        {(!status.isError && admins && Array.isArray(admins)) && <>
            {admins.map((contact) => {
                return (<ListItem disablePadding key={contact.username} secondaryAction={
                    <IconButton edge="end" aria-label="delete" color={"primary"}
                                                onClick={() => {
                                                    setCurrentlyDeletedContact(contact)
                                                    setDeleteDialogOpen(true);
                                                }}
                    >
                        <DeleteIcon/>
                    </IconButton>
                }>
                    <ListItemButton>
                        <ListItemText primary={contact.username}/>
                    </ListItemButton>
                </ListItem>)
            })}
        </>}
        {(!status.isError && !status.callInProgress && !admins.length) && <>
            <Typography variant="p" className={"text-center"}>
                No administrators matching given criteria were found.
            </Typography>
        </>}
        {status.callInProgress &&
            <ListItem disablePadding className={"flex !justify-center mt-3 flex-row"}>
                <CircularProgress className={'ml-3'} color="primary"/>
            </ListItem>
        }
    </List>
        <ControlledDraggableDialog title={"Delete admin"}
                                   Content={<DeleteAdminBody
                                       admin={currentlyDeletedContact}
                                       onSubmit={onDeleteContact}
                                       status={deleteStatus}/>}
                                   dialogButtonContent={"Delete admin"}
                                   open={deleteDialogOpen}
                                   setOpen={setDeleteDialogOpen}
        />
    </div>);
}