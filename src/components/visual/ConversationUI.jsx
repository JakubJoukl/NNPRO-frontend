import ListItem from "@mui/material/ListItem";
import {Alert, Button, CircularProgress} from "@mui/material";
import {ConversationToolBar} from "./ConversationToolBar.jsx";
import {MessageTypingBox} from "./MessageTypingBox.jsx";
import {MessageList} from "../functional/messageList.jsx";

export function ConversationUI({conversation, status, reseErr, onSendMessage, sendStatus}) {

    function renderLoadErrorHeadings() {
        return <>
            {status?.isError && (<>
                <Alert
                    severity={"error"}
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    Error occurred during loading of conversation.
                </Alert>
                <Button
                    size="large" variant="outlined"
                    onClick={() => {
                        reseErr()
                    }
                    }
                    color={"primary"}
                >Reload</Button>
            </>)
            }
            {status.callInProgress &&
                <ListItem disablePadding key={"progressCircle"} className={"flex !justify-center mt-3 flex-row"}>
                    <CircularProgress className={'ml-3'} color="primary"/>
                </ListItem>
            }
        </>;
    }

    return <div className={"flex flex-col h-full flex-grow"}>{renderLoadErrorHeadings()}
        {(!status.isError && status.callFinished) && <>
            <ConversationToolBar conversation={conversation}/>
            <MessageList/>
            <MessageTypingBox onSendMessage={onSendMessage} status={sendStatus}/>
        </>}
    </div>
}