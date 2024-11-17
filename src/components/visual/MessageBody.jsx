import ListItem from "@mui/material/ListItem";
import {Alert, Button, CircularProgress} from "@mui/material";

export default function MessageBody({messages, status, handleOnLoadMore}) {
    return (<div className={"flex-grow border-b-2 p-3"}>
        {status?.isError && (<>
            <ListItem disablePadding key={"error"}>
                <Alert
                    severity={"error"}
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    Error occurred during loading of messages.
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
        {(!status.isError && messages && Array.isArray(messages)) && <>

        </>}
        {status.callInProgress &&
            <ListItem disablePadding key={"progressCircle"} className={"flex !justify-center mt-3 flex-row"}>
                <CircularProgress className={'ml-3'} color="primary"/>
            </ListItem>
        }
    </div>)
}