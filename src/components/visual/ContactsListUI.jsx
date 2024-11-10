import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {Alert, Button, CircularProgress, Typography} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';

export function ContactsListUI({contacts, status, handleOnLoadMore}) {

    return (<div className={"w-full flex flex-col items-center"}><List className={"w-[50rem] max-w-full"}>
        {status?.isError && (<>
            <ListItem disablePadding key={"error"}>
                <Alert
                    severity={"error"}
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    Error occurred during loading of contacts.
                </Alert>
            </ListItem>
            <ListItem disablePadding key={"reloadButton"} className={"flex !justify-center mt-3 flex-row"}>
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
            {contacts.map((contacts) => {
                return (<ListItem disablePadding key={contacts.username} secondaryAction={
                    <IconButton edge="end" aria-label="delete" color={"primary"}>
                        <DeleteIcon/>
                    </IconButton>
                }>
                    <ListItemButton>
                        <ListItemText primary={contacts.username}/>
                    </ListItemButton>
                </ListItem>)
            })}
        </>}
        {(!status.isError && !status.callInProgress && !contacts.length) && <>
            <Typography variant="p" className={"text-center"}>
                You don&#39;t have any contacts.
            </Typography>
        </>}
        {status.callInProgress &&
            <ListItem disablePadding key={"progressCircle"} className={"flex !justify-center mt-3 flex-row"}>
                <CircularProgress className={'ml-3'} color="primary"/>
            </ListItem>
        }
    </List></div>);
}