import {Typography} from "@mui/material";
import {ContactsList} from "../components/functional/contactsList.jsx";
import NewConversationWidget from "../components/functional/newConversationWidget.jsx";

export function NewConversationRoute() {
    return <div className={"text-center"}>
        <Typography variant="h4" gutterBottom className={"w-full"} textAlign={"center"}>
            New conversation
        </Typography>
        <NewConversationWidget/>
    </div>
}