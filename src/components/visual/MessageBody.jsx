import ListItem from "@mui/material/ListItem";
import {Alert, Button, CircularProgress} from "@mui/material";
import {MessageBubble} from "./MessageBubble.jsx";
import {useTheme} from '@mui/material/styles';
import {useContext} from "react";
import {UserContext} from "../../context/userContext.js";

export default function MessageBody({messages, status, handleOnLoadMore}) {
    const theme = useTheme();
    const {userContext} = useContext(UserContext);

    const formatter = new Intl.DateTimeFormat(undefined, {
        dateStyle: 'full',  // Full date format
        timeStyle: 'medium' // Includes hours, minutes, seconds
    });


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
        {(!status.isError && messages && Array.isArray(messages)) && <div className={"space-y-3 flex flex-col"}>
            {messages.map((message) => {
                if (message.sender === userContext.username) {
                    return (<MessageBubble key={message.id} messageText={message.message} sender={message.sender}
                                           arrivalTime={formatter.format(new Date(message.dateSend * 1000))}
                                           className={"w-fit ml-auto mr-10"}
                                           textAlign={"right"}
                                           backgroundColor={message.decrypted ? theme.palette.messageOwn.main : theme.palette.messageError.main}
                                           color={message.decrypted ? "black" : theme.palette.messageError.secondary}

                    />);
                } else {
                    return (<MessageBubble key={message.id} messageText={message.message} sender={message.sender}
                                           arrivalTime={formatter.format(new Date(message.dateSend * 1000))}
                                           className={"w-fit ml-10"} textAlign={"left"}
                                           backgroundColor={message.decrypted ? theme.palette.messageForeign.main : theme.palette.messageError.main}
                                           color={message.decrypted ? "black" : theme.palette.messageError.secondary}
                    />);
                }
            })}
        </div>}
        {status.callInProgress &&
            <ListItem disablePadding key={"progressCircle"} className={"flex !justify-center mt-3 flex-row"}>
                <CircularProgress className={'ml-3'} color="primary"/>
            </ListItem>
        }
    </div>)
}