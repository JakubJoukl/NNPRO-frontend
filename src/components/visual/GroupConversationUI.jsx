import {useRef, useState} from "react";
import List from "@mui/material/List";
import {Alert, Button, CircularProgress, Paper, TextField, Typography} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import {Grid} from "@mui/system";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

export function GroupConversationUI({status, onSubmit, setFilterName, contacts, handleOnLoadMore}) {
    const timeoutRef = useRef();
    const [selectedContacts, setSelectedContacts] = useState({list: [], map: new Map()});


    function _renderSearchBody() {
        return (<List className={"w-full flex flex-col flex-grow overflow-auto"}>
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
                    return (<ListItem disablePadding key={contact.username+"_search"} onClick={() => {
                        setSelectedContacts((prevState) => {
                            if(prevState.map.has(contact.username)){
                                return prevState;
                            }
                            const newMap = new Map(prevState.map);
                            newMap.set(contact.username, contact)
                            return {
                                map: newMap,
                                list: [...prevState.list, contact]
                            }
                        });
                    }}>
                        <ListItemButton>
                            <ListItemText primary={contact.username}/>
                        </ListItemButton>
                    </ListItem>)
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
        return (<List className={"w-full flex flex-col flex-grow overflow-auto"}>
                {selectedContacts.list.map((contact) => {
                    return (<ListItem disablePadding key={contact.username+"_selected"} onClick={() => {
                        setSelectedContacts((prevState) => {
                            const newMap = new Map(prevState.map);
                            newMap.delete(contact.username);
                            return {
                                map: newMap,
                                list: prevState.list.filter((item => item.username !== contact.username))
                            }
                        });
                    }}>
                        <ListItemButton>
                            <ListItemText primary={contact.username}/>
                        </ListItemButton>
                    </ListItem>)
                })}
        </List>)
    }


    return (<Paper className={"w-full max-w-screen-lg pb-3 pt-3 flex flex-col flex-grow overflow-auto mb-6 mt-3"}
                   variant={"outlined"} square>
        <Grid container spacing={2} className={"w-full flex flex-col flex-grow overflow-auto"}>
            <Grid size={{xs: 6, md: 6}} className={"flex flex-col flex-grow border-r-2 p-3 overflow-auto"}>
                <Typography variant="p" className={'flex flex-col justify-center !mx-auto pr-12'}>
                    Available contacts
                </Typography>
                {_renderSearchBody()}
            </Grid>
            <Grid size={{xs: 6, md: 6}} className={"p-3 flex flex-col flex-grow overflow-auto"}>
                <Typography variant="p" className={'flex flex-col justify-center !mx-auto pr-12'}>
                    Contacts in conversation
                </Typography>
                {_renderSelectedBody()}
            </Grid>
        </Grid></Paper>);
}