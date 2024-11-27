import {Paper} from "@mui/material";
import {TextareaAutosize} from '@mui/base/TextareaAutosize';
import IconButton from "@mui/material/IconButton";
import SendIcon from '@mui/icons-material/Send';
import {useRef, useState} from "react";
import {useStompClient} from "react-stomp-hooks";

export function MessageTypingBox({onSendMessage}) {
    const [message, setMessage] = useState('');
    const inputRef = useRef(null);
    const buttonRef= useRef(null);

    const stompClient = useStompClient();

    return (<Paper elevation={3} className={"p-3 flex flex-col justify-center items-center"}>
        <TextareaAutosize ref={inputRef} className={"resize-none w-full outline-0 pr-32"} maxRows={6} minRows={3} value={message}
                          onKeyDown={(e)=>{
                              if(e.code === "Enter" && !e.shiftKey){
                                  buttonRef.current?.click();
                                  e.preventDefault();
                              }
                          }}
                          onChange={(event) => setMessage(() => {
                              let input = event.target.value;
                              if (input.length > 500) {
                                  input = input.substring(0, 4000);
                              }
                              return input;
                          })}/>
        <IconButton ref={buttonRef} disabled={message.length <= 0} className={"!absolute right-24"} onClick={async () => {
            //onSendMessage(message);
            if (stompClient) {
                onSendMessage(stompClient, message);
            } else {
                console.log("No stomp lol");
            }
            setMessage('');
            inputRef.current?.focus();
        }}>
            <SendIcon/>
        </IconButton>
    </Paper>);
}