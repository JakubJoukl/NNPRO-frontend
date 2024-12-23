import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {Alert, Button, CircularProgress, TextField, Typography} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckIcon from '@mui/icons-material/Check';
import {useRef} from "react";

export function UsersListUI({
                                usersList,
                                status,
                                handleOnLoadMore,
                                setFilteredName,
                                handleOnAddUser,
                                addedUsers,
                                userIsAddedFunction
                            }) {
    const timeoutRef = useRef();

    function _getUserAddBody(user) {
        if (userIsAddedFunction(user) || (addedUsers[user.username] && addedUsers[user.username]?.progress !== "inProgress")) {
            return (<IconButton edge="end" aria-label="add" color={"primary"}>
                <CheckIcon/>
            </IconButton>);
        }
        if (addedUsers[user.username]?.progress === "inProgress") {
            return (<CircularProgress style={{height: "1.5em", width: "1.5em"}} color="primary"/>);
        }

        return (<IconButton edge="end" aria-label="add" color={"primary"}
                            onClick={() => handleOnAddUser(user)}>
            <AddCircleIcon/>
        </IconButton>);

    }


    return (<div className={"w-full flex flex-col items-center"}><List className={"w-[50rem] max-w-full"}>
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
            {usersList.map((user) => {
                return (<ListItem disablePadding key={user.username} secondaryAction={
                    _getUserAddBody(user)
                }>
                    <ListItemButton>
                        <ListItemText primary={user.username}/>
                    </ListItemButton>
                </ListItem>)
            })}
            {(status.hasMore) &&
                <ListItem disablePadding key={"reloadButton"} className={"flex !justify-center mt-3 flex-row"}>
                    <Button
                        size="large" variant="outlined"
                        disabled={status.callInProgress}
                        onClick={() => {
                            handleOnLoadMore()
                        }
                        }
                        color={"primary"}
                    >Load more</Button>
                </ListItem>}
        </>}

        {(!status.isError && !status.callInProgress && !usersList.length) && <>
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