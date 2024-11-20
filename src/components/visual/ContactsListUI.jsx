import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {Alert, Button, CircularProgress, TextField, Typography} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import {useRef} from "react";

export function ContactsListUI({contacts, status, handleOnLoadMore, setFilteredName, deleteEnabled, handleOnClick}) {
    const timeoutRef = useRef();
    //Maybe filtering textfield deserves to be in separate component?
    return (<div className={"w-full flex flex-col items-center"}><List className={"w-full 2xl:w-[50rem] lg:w-[43rem]"}>
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
                return (<ListItem disablePadding key={contact.username} secondaryAction={
                    deleteEnabled ? <IconButton edge="end" aria-label="delete" color={"primary"}>
                        <DeleteIcon/>
                    </IconButton> : null
                } onClick={() =>{
                    if(handleOnClick){
                        handleOnClick(contact);
                    }
                }}>
                    <ListItemButton>
                        <ListItemText primary={contact.username}/>
                    </ListItemButton>
                </ListItem>)
            })}
        </>}
        {(!status.isError && !status.callInProgress && !contacts.length) && <>
            <Typography variant="p" className={"text-center"}>
                No contacts matching given criteria were found.
            </Typography>
        </>}
        {status.callInProgress &&
            <ListItem disablePadding className={"flex !justify-center mt-3 flex-row"}>
                <CircularProgress className={'ml-3'} color="primary"/>
            </ListItem>
        }
    </List></div>);
}