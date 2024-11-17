import ListItem from "@mui/material/ListItem";
import {Alert, AppBar, Button, CircularProgress, MenuItem, Typography} from "@mui/material";
import * as React from "react";
import IconButton from "@mui/material/IconButton";
import {Menu} from "@mui/base";
import Toolbar from "@mui/material/Toolbar";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {ConversationToolBar} from "./ConversationToolBar.jsx";

export function ConversationUI({conversation, status, reseErr}) {

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

    return <div>{renderLoadErrorHeadings()}
        {(!status.isError && status.callFinished) && <ConversationToolBar conversation={conversation}/>}
    </div>
}