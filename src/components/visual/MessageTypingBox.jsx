import {Paper} from "@mui/material";
import {TextareaAutosize} from '@mui/base/TextareaAutosize';
import IconButton from "@mui/material/IconButton";
import SendIcon from '@mui/icons-material/Send';

export function MessageTypingBox() {
    return (<Paper elevation={3} className={"p-3 flex flex-col justify-center items-center"}>
        <TextareaAutosize className={"resize-none w-full outline-0 pr-32"} maxRows={6} minRows={3}/>
        <IconButton className={"!absolute right-24"}>
            <SendIcon/>
        </IconButton>
    </Paper>);
}