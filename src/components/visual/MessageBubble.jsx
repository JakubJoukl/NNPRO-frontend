import {Card, CardContent, Typography} from "@mui/material";
import * as React from "react";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {useSubmitCall} from "../../hooks/useSubmitCall.js";
import {CircularWithValueLabel} from "./CircularWithValueLabel.jsx";


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
                                  isOwn,
                                  validTo,
                                  dateSend,
                                  notifyExpired
                              }) {
    const {status, call} = useSubmitCall('deleteMessage', "Message deleted.", "Deleting of message failed.");

    function handleOnNotifyExpired() {
        notifyExpired(messageId);
    }

    return (
        <Card className={className} style={{backgroundColor: backgroundColor}} ref={refProp}>
            <CardContent className={"break-words"}>
                <div className={"flex flex-row"}>
                    <div className={"flex flex-col"}>
                        <Typography gutterBottom sx={{fontSize: 14}} component="p" textAlign={textAlign}
                                    color={color}>
                            {arrivalTime}
                        </Typography>
                        <div className={"flex flex-row justify-between min-h-8"}>
                            <Typography gutterBottom sx={{fontSize: 14}} textAlign={textAlign}
                                        color={color}>
                                <b>{sender}</b>
                            </Typography>
                            {validTo && <CircularWithValueLabel color={color} validTo={Date.parse(validTo)}
                                                                validFrom={Date.parse(dateSend)} notifyExpired={handleOnNotifyExpired}/>}
                        </div>
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