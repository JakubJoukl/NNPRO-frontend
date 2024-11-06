import {Button, Typography} from "@mui/material";
import {ContactsList} from "../components/functional/contactsList.jsx";
import {DraggableDialog} from "../components/visual/DraggableDialog.jsx";
import {UsersList} from "../components/functional/usersList.jsx";

export function ContactsRoute(){
    return <div className={"text-center"}>
        <Typography variant="h4" gutterBottom className={"w-full"} textAlign={"center"}>
            Your contacts
        </Typography>
        <DraggableDialog title={"Add new contact"} Content={<UsersList/>} dialogButtonContent={"Add new contact"} OpenDialogButton={Button}/>
        <ContactsList/>
    </div>
}