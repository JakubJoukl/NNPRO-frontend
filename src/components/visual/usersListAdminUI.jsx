import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {Alert, Button, CircularProgress, TextField, Typography} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import {useRef, useState} from "react";
import {ControlledDraggableDialog} from "./ControlledDraggableDialog.jsx";
import {ConfirmationDialog} from "./confirmationDialog.jsx";
import {useSubmitCall} from "../../hooks/useSubmitCall.js";
import {Box} from "@mui/system";

export function UsersAdminListUI({
                                     users,
                                     status,
                                     handleOnLoadMore,
                                     setFilteredName,
                                     onCallback,
                                     header,
                                     action,
                                     confirmationPrompt,
                                     confirmationDialogTitle
                                 }) {
    const timeoutRef = useRef();
    const [selectedUser, setSelectedUser] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const {status: actionStatus, call, dtoOut} = useSubmitCall(
        action.method, action.successMessage,
        action.failedMessage,
        onActionCallback
    );

    function onConfirmation() {
        call({username: selectedUser.username});
    }

    function onActionCallback() {
        onCallback(selectedUser);
        setDialogOpen(false);
    }

    //Maybe filtering textfield deserves to be in separate component?
    return (<div className={"w-full flex flex-col items-center"}>
        <Typography variant="h5">{header}</Typography>
        <List className={"w-full"}>
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
                        Error occurred during loading of users.
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
            {(!status.isError && users && Array.isArray(users)) && <>
                {users.map((contact) => {
                    return (<ListItem disablePadding key={contact.username} secondaryAction={
                        <Box className={"space-x-3"}>
                            <IconButton edge="end" aria-label="delete" color={"primary"}
                                        onClick={() => {
                                            setSelectedUser(contact)
                                            setDialogOpen(true);
                                        }}
                            >
                                <action.ActionIcon/>
                            </IconButton>
                        </Box>
                    }>
                        <ListItemButton>
                            <ListItemText primary={contact.username}/>
                        </ListItemButton>
                    </ListItem>)
                })}
            </>}
            {(!status.isError && !status.callInProgress && !users.length) && <>
                <Typography variant="p" className={"text-center"}>
                    No users matching given criteria were found.
                </Typography>
            </>}
            {status.callInProgress &&
                <ListItem disablePadding className={"flex !justify-center mt-3 flex-row"}>
                    <CircularProgress className={'ml-3'} color="primary"/>
                </ListItem>
            }
        </List>
        <ControlledDraggableDialog title={confirmationDialogTitle}
                                   Content={<ConfirmationDialog
                                       onSubmit={onConfirmation}
                                       confirmationText={"Confirm"}
                                       status={actionStatus}>
                                       <Typography textAlign={"center"} className={"m-auto"}
                                                   sx={{p: 1}}>{confirmationPrompt} <Typography color={"primary"}
                                                                                                variant={"span"}>{
                                           <b>{selectedUser?.username}</b>}</Typography>?</Typography>
                                   </ConfirmationDialog>}
                                   dialogButtonContent={confirmationDialogTitle}
                                   open={dialogOpen}
                                   setOpen={setDialogOpen}
        />
    </div>);
}