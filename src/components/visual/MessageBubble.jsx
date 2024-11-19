import {Card, CardContent, Paper, Typography} from "@mui/material";
import * as React from "react";
import Divider from "@mui/material/Divider";

export function MessageBubble({messageText, sender, arrivalTime, className, backgroundColor, color, textAlign}) {
    return (
        <Card className={className} style={{backgroundColor: backgroundColor}}>
            <CardContent className={"break-words"}>
                    <Typography gutterBottom sx={{fontSize: 14}} component="p" textAlign={textAlign}
                                color={color}>
                        {arrivalTime}
                    </Typography>
                    <Typography gutterBottom sx={{fontSize: 14}} textAlign={textAlign}
                                color={color}>
                        <b>{sender}</b>
                    </Typography>

                <Divider className={"!mb-4"} color={color}/>
                <Typography variant="body2" color={color} textAlign={"left"}>
                    {messageText}
                </Typography>
            </CardContent>
        </Card>
    );
}