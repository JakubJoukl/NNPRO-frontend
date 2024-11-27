import {Card, CardContent, Typography} from "@mui/material";
import * as React from "react";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {useSubmitCall} from "../../hooks/useSubmitCall.js";


export function MessageBubble({
                                  messageText,
                                  sender,
                                  arrivalTime,
                                  className,
                                  backgroundColor,
                                  color,
                                  textAlign,
                                  refProp,
                                  messageId,
                                  isOwn
                              }) {
    const {status,call} = useSubmitCall('deleteMessage', "Message deleted.", "Deleting of message failed.");

    return (
        <Card className={className} style={{backgroundColor: backgroundColor}} ref={refProp}>
            <CardContent className={"break-words"}>
                <div className={"flex flex-row"}>
                    <div className={"flex flex-col"}>
                        <Typography gutterBottom sx={{fontSize: 14}} component="p" textAlign={textAlign}
                                    color={color}>
                            {arrivalTime}
                        </Typography>
                        <Typography gutterBottom sx={{fontSize: 14}} textAlign={textAlign}
                                    color={color}>
                            <b>{sender}</b>
                        </Typography>
                    </div>
                    {isOwn && <IconButton disabled={status.callInProgress} onClick={() =>
                        call({id: messageId}
                        )
                    }>
                        <DeleteForeverIcon fontSize={"medium"}/>
                    </IconButton>}
                </div>
                <Divider className={"!mb-4"} color={color}/>
                <Typography variant="body2" color={color} textAlign={"left"}>
                    {messageText}
                </Typography>
            </CardContent>
        </Card>
    );
}