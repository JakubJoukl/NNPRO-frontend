import ListItem from "@mui/material/ListItem";
import {Alert, Button, CircularProgress} from "@mui/material";
import {MessageBubble} from "./MessageBubble.jsx";
import {useTheme} from '@mui/material/styles';
import {useContext, useEffect, useRef} from "react";
import {UserContext} from "../../context/userContext.js";

export default function MessageBody({messages, status, handleOnLoadMore, hasMore}) {
    const theme = useTheme();
    const {userContext} = useContext(UserContext);
    const bottomElementRef = useRef(null);
    const formatter = new Intl.DateTimeFormat(undefined, {
        dateStyle: 'full',  // Full date format
        timeStyle: 'medium' // Includes hours, minutes, seconds
    });
    const initialScroll = useRef(true);
    // so we can track that new message arrived
    const firstMessageId = messages[0]?.id;
    const lastMessageId = messages[messages.length - 1]?.id;
    const lastMessageRef = useRef(null);
    const previousLastMessage = useRef(null);
    const lastMessage = lastMessageRef.current;

    useEffect(() => {
        if (lastMessageRef.current !== previousLastMessage.current && previousLastMessage.current) {
            previousLastMessage.current.scrollIntoView({
                behavior: "instant",
                block: "end",
            });
        }
        previousLastMessage.current = lastMessage;
    }, [lastMessage, lastMessageId]);

    useEffect(() => {
        let behavior = "smooth";
        if (initialScroll.current) {
            if (firstMessageId) {
                initialScroll.current = false;
            }
            behavior = "instant";
        }
        bottomElementRef.current?.scrollIntoView({
            behavior,
            block: "end",
        });
    }, [firstMessageId]);

    const shouldDisplayMessages = (!status.isError && messages && Array.isArray(messages));

    function _mapMessages() {
        return messages.map((message, index) => {
            if (message.sender === userContext.username) {
                return (<MessageBubble key={message.id} messageText={message.message} sender={message.sender}
                                       arrivalTime={formatter.format(new Date(message.dateSend * 1000))}
                                       className={"w-fit ml-auto md:max-w-[60%] sm:max-w-[70%] max-w-[80%]"}
                                       textAlign={"right"}
                                       backgroundColor={message.decrypted ? theme.palette.messageOwn.main : theme.palette.messageError.main}
                                       refProp={index === messages.length - 1 ? lastMessageRef : null}
                                       color={message.decrypted ? "black" : theme.palette.messageError.secondary}

                />);
            } else {
                return (<MessageBubble key={message.id} messageText={message.message} sender={message.sender}
                                       arrivalTime={formatter.format(new Date(message.dateSend * 1000))}
                                       className={"w-fit md:max-w-[60%] sm:max-w-[70%] max-w-[80%]"}
                                       textAlign={"left"}
                                       refProp={index === messages.length - 1 ? lastMessageRef : null}
                                       backgroundColor={message.decrypted ? theme.palette.messageForeign.main : theme.palette.messageError.main}
                                       color={message.decrypted ? "black" : theme.palette.messageError.secondary}
                />);
            }
        });

    }

    const mappedMessages = shouldDisplayMessages ? _mapMessages() : null;

    return (<div className={"flex-grow border-b-2 p-3 overflow-y-auto"}>
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
        {shouldDisplayMessages && <div className={"space-y-3 flex flex-col-reverse"}>
            <div ref={bottomElementRef}/>
            {mappedMessages}
            {hasMore && status.callFinished && <div>
                <Button
                    size="large" variant="outlined"
                    onClick={() => {
                        handleOnLoadMore();
                    }
                    }
                    color={"primary"}
                >Load more</Button>
            </div>}
        </div>}
        {status.callInProgress &&
            <ListItem disablePadding key={"progressCircle"} className={"flex !justify-center mt-3 flex-row"}>
                <CircularProgress className={'ml-3'} color="primary"/>
            </ListItem>
        }
    </div>)
}