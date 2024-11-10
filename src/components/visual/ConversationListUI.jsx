import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {Alert, Button, CircularProgress} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

export function ConversationListUI({conversations, status, handleOnLoadMore}) {

    return (<List>
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
        {(!status.isError && conversations && Array.isArray(conversations)) && <>
            {conversations.map((conversation) => {
                return (<ListItem disablePadding key={conversation.id}>
                    <ListItemButton>
                        <ListItemText primary={conversation.name}/>
                    </ListItemButton>
                </ListItem>)
            })}
        </>}
        {status.callInProgress &&
            <ListItem key={"progress"} disablePadding key={"progressCircle"} className={"flex !justify-center mt-3 flex-row"}>
                <CircularProgress className={'ml-3'} color="primary"/>
            </ListItem>
        }
    </List>);
}