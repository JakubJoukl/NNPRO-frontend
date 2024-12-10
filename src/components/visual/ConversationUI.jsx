import ListItem from "@mui/material/ListItem";
import {Alert, Button, CircularProgress} from "@mui/material";
import {ConversationToolBar} from "./ConversationToolBar.jsx";
import {MessageTypingBox} from "./MessageTypingBox.jsx";
import {MessageList} from "../functional/messageList.jsx";
import {useContext} from "react";
import {UserContext} from "../../context/userContext.js";
import withAlert from "./withAlert.jsx";
import {GlobalAlertContext} from "../../context/globalAlertContext.js";


function ConversationUI({
                            conversation,
                            status,
                            reseErr,
                            onSendMessage,
                            conversationId,
                            decryptedKey,
                            openAlert,
                            closeAlert
                        }) {
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

    return (<GlobalAlertContext.Provider value={{openAlert, closeAlert}}>
        <div className={"flex flex-col flex-grow overflow-auto"}>{renderLoadErrorHeadings()}
            {(!status.isError && status.callFinished) && <>
                <ConversationToolBar conversation={conversation} decryptedKey={decryptedKey.rawKey}/>
                <MessageList conversationId={conversationId} decryptedKey={decryptedKey.importedKey}/>
                <MessageTypingBox onSendMessage={onSendMessage}/>
            </>}
        </div>
    </GlobalAlertContext.Provider>)
}

const WrappedConversationUI = withAlert(ConversationUI);
export {WrappedConversationUI as ConversationUI}
