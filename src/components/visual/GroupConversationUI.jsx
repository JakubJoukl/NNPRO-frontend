import {useContext, useRef, useState} from "react";
import List from "@mui/material/List";
import {Alert, Button, CircularProgress, Paper, TextField, Typography} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import {Grid} from "@mui/system";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import {GlobalAlertContext} from "../../context/globalAlertContext.js";
import {PopoverContactButton} from "./PopoverContactButton.jsx";

export function GroupConversationUI({status, onSubmit, setFilterName, contacts, handleOnLoadMore}) {
    const timeoutRef = useRef();
    const [selectedContacts, setSelectedContacts] = useState({list: [], map: new Map()});
    const {openAlert} = useContext(GlobalAlertContext);
    const [conversationName, setConversationName] = useState("");
    const typingTimeoutRef = useRef({});
    // True means valid, false means invalid
    const [validations, setValidations] = useState({conversationName: true});

    function validateWithTimeout(changedKey, value) {
        if (typingTimeoutRef.current[changedKey]) clearTimeout(typingTimeoutRef.current[changedKey]);
        // Set a new timeout for delayed validation
        const timeoutId = setTimeout(() => {
            validate(changedKey, value);
        }, 500);
        // Update the timeout ID for this specific input
        typingTimeoutRef.current[changedKey] = timeoutId
    }

    function validate(changedKey, targetValue) {
        let conversationNameIsValid;

        //https://www.auditboard.com/blog/nist-password-guidelines/
        const userNameRegex = "^.{7,29}$";
        switch (changedKey) {
            case "conversationName":
                conversationNameIsValid = targetValue?.match(userNameRegex);
                break;
            default:
                //all - so we have no target value... should not be used in onChange as the state change is not guaranteed to be on time of validation...
                conversationNameIsValid = conversationName?.match(userNameRegex);
                break;
        }

        setValidations({
            conversationName: conversationNameIsValid
        });
        return {
            conversationName: conversationNameIsValid,
        };
    }

    function setSelectedContact(contact){
        setSelectedContacts((prevState) => {
            if (prevState.map.has(contact.username)) {
                return prevState;
            }
            const newMap = new Map(prevState.map);
            newMap.set(contact.username, contact)
            return {
                map: newMap,
                list: [...prevState.list, contact]
            }
        });
    }

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
                    return (<PopoverContactButton key={contact.username + "_search"} contact={contact} onContactClicked={setSelectedContact}/>)
                })}
            </>}
            {status.callInProgress &&
                <ListItem disablePadding className={"flex !justify-center mt-3 flex-row"}>
                    <CircularProgress className={'ml-3'} color="primary"/>
                </ListItem>
            }
        </List>)
    }


    function _renderSelectedBody() {
        return (<List className={"w-full flex flex-col flex-grow overflow-auto border-t-2"}>
            {selectedContacts.list.map((contact) => {
                return (<ListItem disablePadding key={contact.username + "_selected"} >
                    <ListItemButton onClick={() => {
                        setSelectedContacts((prevState) => {
                            const newMap = new Map(prevState.map);
                            newMap.delete(contact.username);
                            return {
                                map: newMap,
                                list: prevState.list.filter((item => item.username !== contact.username))
                            }
                        });
                    }}>
                        <ListItemText primary={contact.username}/>
                    </ListItemButton>
                </ListItem>)
            })}
        </List>)
    }


    return (<div className={"w-full overflow-auto flex flex-col max-w-screen-lg"}>
        <TextField onChange={(e) => {
            setConversationName(() => e.target.value)
            validateWithTimeout("conversationName", e.target.value);
        }}
                   id="conversationName"
                   label="Conversation name" variant="filled" className={"w-full"}
                   error={!(validations.conversationName)}
                   helperText={!(validations.conversationName) && "Conversation name must be between 7 and 29 characters long."}
        />
        <Paper className={"w-full pb-3 pt-3 flex flex-col flex-grow overflow-auto mb-6 mt-3 justify-center items-center"}
                   variant={"outlined"} square>
        <Grid container spacing={2} className={"w-full flex flex-col flex-grow pb-3 overflow-auto"}>
            <Grid size={{xs: 12, md: 6}} className={"flex flex-col flex-grow border-r-2 p-3 overflow-auto"}>
                <Typography variant="p" className={'flex flex-col justify-center !mx-auto pr-12'}>
                    Available contacts
                </Typography>
                {_renderSearchBody()}
            </Grid>
            <Grid size={{xs: 12, md: 6}} className={"p-3 flex flex-col flex-grow overflow-auto"}>
                <Typography variant="p" className={'flex flex-col justify-center !mx-auto pr-12'}>
                    Contacts in conversation
                </Typography>
                {_renderSelectedBody()}
            </Grid>
        </Grid>
    <Button disabled={selectedContacts.list.length === 0} color={"primary"} size="large" variant={"contained"} className={"w-fit"} onClick={() => {
        const result = validate();
        if (result.conversationName) {
            onSubmit(conversationName, selectedContacts.list);
        } else {
            openAlert("Conversation name is not valid. Fix it before proceeding.", "error")
        }
    }}>Create conversation</Button>
    </Paper></div>);
}