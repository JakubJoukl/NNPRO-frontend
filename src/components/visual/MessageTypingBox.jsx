import {Paper} from "@mui/material";
import {TextareaAutosize} from '@mui/base/TextareaAutosize';
import IconButton from "@mui/material/IconButton";
import SendIcon from '@mui/icons-material/Send';
import {useState} from "react";
import {useStompClient} from "react-stomp-hooks";

export function MessageTypingBox({onSendMessage, status}) {
    const [message, setMessage] = useState('');

    const stompClient = useStompClient();

    return (<Paper elevation={3} className={"p-3 flex flex-col justify-center items-center"}>
        <TextareaAutosize className={"resize-none w-full outline-0 pr-32"} maxRows={6} minRows={3} value={message}
                          onChange={(event) => setMessage(() => {
                              let input = event.target.value;
                              if (input.length > 500) {
                                  input = input.substring(0, 4000);
                              }
                              return input;
                          })}/>
        <IconButton disabled={status.callInProgress} className={"!absolute right-24"} onClick={() => {
            //onSendMessage(message);
            if (stompClient) {
                //Send Message
                stompClient.publish({
                    destination: "/app/echo",
                    body: "Echo 123",
                });
            } else {
                console.log("No stomp lol");
                //Handle error
            }
            setMessage('');
        }}>
            <SendIcon/>
        </IconButton>
    </Paper>);
}