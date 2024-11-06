import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {Alert, Button, CircularProgress, Typography} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from '@mui/icons-material/AddCircle';

export function UsersListUI({usersList, status, handleOnLoadMore}) {

    return (<div className={"w-full flex flex-col items-center"}><List className={"w-[50rem] max-w-full"}>
        {status?.isError && (<>
            <ListItem disablePadding key={"error"}>
                <Alert
                    severity={"error"}
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    Error occurred during loading of users.
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
        {(!status.isError && usersList && Array.isArray(usersList)) && <>
            {usersList.map((contacts) => {
                return (<ListItem disablePadding key={contacts.username} secondaryAction={
                    <IconButton edge="end" aria-label="add">
                        <AddCircleIcon/>
                    </IconButton>
                }>
                    <ListItemButton>
                        <ListItemText primary={contacts.username}/>
                    </ListItemButton>
                </ListItem>)
            })}
        </>}
        {(!status.isError &&  !status.callInProgress && !usersList.length) && <>
        <Typography variant="p" className={"text-center"}>
            No users found.
        </Typography>
        </>}
        {status.callInProgress &&
            <ListItem disablePadding key={"progressCircle"} className={"flex !justify-center mt-3 flex-row"}>
                <CircularProgress className={'ml-3'} color="primary"/>
            </ListItem>
        }
    </List></div>);
}