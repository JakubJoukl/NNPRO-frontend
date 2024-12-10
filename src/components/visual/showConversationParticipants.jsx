import {Button, Typography} from "@mui/material";
import * as React from "react";

export function ShowConversationParticipants({users}) {
    return (<div className={"flex flex-col items-start justify-start"}>
            {users.map((user) => {
                return (<div key={user.username}>
                    <Typography
                        fontWeight={"bold"}
                        variant="span"
                        color={"primary"}>{user.username}</Typography>
                </div>);
            })}
        </div>
    )
}