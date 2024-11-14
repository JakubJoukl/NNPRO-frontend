import {Typography} from "@mui/material";
import NewConversationWidget from "../components/functional/newConversationWidget.jsx";

export function NewConversationRoute() {
    return <div className={"text-center flex-col items-center flex"}>
        <Typography variant="h4" gutterBottom className={"w-full"} textAlign={"center"}>
            New conversation
        </Typography>
        <NewConversationWidget/>
    </div>
}