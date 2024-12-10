import {useContext, useRef, useState} from "react";
import {GlobalAlertContext} from "../../context/globalAlertContext.js";
import List from "@mui/material/List";
import {Alert, Button, CircularProgress, Paper, TextField, Typography} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import {PopoverContactButton} from "./PopoverContactButton.jsx";
import {UserContext} from "../../context/userContext.js";

export function AddUserToConversationBodyUI({status, onSubmit, setFilterName, contacts, handleOnLoadMore, submitStatus}) {
    const timeoutRef = useRef();
    const {openAlert} = useContext(GlobalAlertContext);
    const [selectedUser, setSelectedUser] = useState(null);
    const {userContext} = useContext(UserContext);

    function _renderSearchBody() {
        return (<List className={"w-full flex flex-col flex-grow overflow-auto border-t-2"}>
            <TextField onChange={(e) => {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                }
                timeoutRef.current = setTimeout(() => {
                    setFilterName(e.target.value);
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
                        Error occurred during loading of contacts.
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
            {(!status.isError && contacts && Array.isArray(contacts)) && <>
                {contacts.map((contact) => {
                    return (<PopoverContactButton key={contact.username + "_search"} contact={contact}
                                                  onContactClicked={(user) => setSelectedUser(user)}/>)
                })}
            </>}
            {status.callInProgress &&
                <ListItem disablePadding className={"flex !justify-center mt-3 flex-row"}>
                    <CircularProgress className={'ml-3'} color="primary"/>
                </ListItem>
            }
        </List>)
    }
    if(selectedUser){
        return <div className={"flex flex-col items-center justify-center space-y-3"}>
            <Typography textAlign={"center"} className={"m-auto"} sx={{p: 1}}>Are you sure you want to add user <Typography color={"primary"} variant={"span"}>{
                <b>{selectedUser.username}</b>}</Typography> to conversation?</Typography>
            <div className={"flex flex-row space-x-6"}>
                <Button onClick={() => setSelectedUser(null)} variant={"outlined"}>Back to selection</Button>
                <Button disabled={submitStatus?.callInProgress || userContext.privateKey == null} onClick={() => onSubmit(selectedUser)} variant={"contained"}>Confirm</Button>
            </div>
            {userContext.privateKey == null && <Typography color={"red"} textAlign={"center"} className={"m-auto"} sx={{p: 1}}>In order to add user, you have to upload your private key first.</Typography>}
        </div>
    }

    return (<div className={"w-full overflow-auto flex flex-col max-w-screen-lg"}>
        {_renderSearchBody()}
    </div>);
}