import {FormControlLabel, Paper, Switch, TextField} from "@mui/material";
import {TextareaAutosize} from '@mui/base/TextareaAutosize';
import IconButton from "@mui/material/IconButton";
import SendIcon from '@mui/icons-material/Send';
import {useRef, useState} from "react";
import {useStompClient} from "react-stomp-hooks";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

export function MessageTypingBox({onSendMessage}) {
    const [message, setMessage] = useState('');
    const inputRef = useRef(null);
    const buttonRef = useRef(null);
    const [disappearing, setDisappearing] = useState(false);
    const [disapperanceTime, setDisapperanceTime] = useState(5);
    const [showMenu, setShowMenu] = useState(false);

    const stompClient = useStompClient();

    let menuClassNames = "p-3 flex flex-row justify-center items-center relative transition-all box-border overflow-hidden";
    if (!showMenu) {
        menuClassNames += " h-3";
    }else{
        menuClassNames += " h-20";
    }
    return (<div>
        <div className={menuClassNames}>
            <IconButton className={"!absolute justify-self-start right-3 top-0 bottom-0"}
                        onClick={() => setShowMenu((prevState) => !prevState)}>
                {!showMenu && <KeyboardDoubleArrowUpIcon/>}
                {showMenu && <KeyboardDoubleArrowDownIcon/>}
            </IconButton>

            {showMenu && <FormControlLabel control={<Switch value={disappearing} onChange={(e) => setDisappearing(e.target.value)}
                                               size={"small"}/>} label="Dissapearing messages"/>}
            {showMenu && <TextField
                size={"small"}
                type="number"
                variant={"filled"}
                value={disapperanceTime}
                slotProps={{
                    inputProps: {
                        max: 31_556_926, min: 5 // max is year
                    }
                }}
                onChange={(e) => {
                    if (e.target.value < 0) {
                        setDisapperanceTime(0);
                        return;
                    }
                    setDisapperanceTime(e.target.value);
                }}
                onBlur={() => {
                    if (disapperanceTime < 5) {
                        setDisapperanceTime(5);
                    } else if (disapperanceTime > 31_556_926) {
                        setDisapperanceTime(31_556_926);
                    }
                }}
                label="Dissaperance time (s)"
            />}
        </div>
        <Paper elevation={3} square className={"p-3 flex flex-col justify-center items-center !relative"}>
            <TextareaAutosize ref={inputRef} className={"resize-none w-full outline-0 pr-32"} maxRows={6} minRows={3}
                              value={message}
                              onKeyDown={(e) => {
                                  if (e.code === "Enter" && !e.shiftKey) {
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
            <IconButton ref={buttonRef} disabled={message.length <= 0} className={"!absolute right-20"}
                        onClick={async () => {
                            const additionalParams = {};
                            if (disappearing && disapperanceTime) {
                                additionalParams.disapperanceTime = disapperanceTime;
                            }
                            if (stompClient) {
                                onSendMessage(stompClient, message, additionalParams);
                            } else {
                                console.error("No stomp lol");
                            }
                            setMessage('');
                            inputRef.current?.focus();
                        }}>
                <SendIcon/>
            </IconButton>
        </Paper></div>);
}