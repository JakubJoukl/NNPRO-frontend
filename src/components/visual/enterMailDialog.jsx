import {Button, TextField, Typography} from "@mui/material";
import {useSubmitCall} from "../../hooks/useSubmitCall.js";
import {useState} from "react";

export function EnterMail({onBack}) {
    // Fixme recapcha

    const {status, call} = useSubmitCall(
        "resetPassword", "Code has been send to your mail.",
        "Sending of reset code has failed. Is entered username correct?"
    );
    const [enteredUsername, setEnteredUsername] = useState("");
    return (<div className={"!space-y-3 flex flex-col"}>
        <Typography variant="p" gutterBottom>
            Enter your mail. We will send you reset code there.
        </Typography>
        <TextField value={enteredUsername} onChange={(e) => {
            setEnteredUsername(e.target.value);
        }}
                   id="username"
                   label="Username" variant="filled" className={"w-full"}/>
        <div className={"flex flex-row justify-around"}>
            <Button className={"w-fit"} size="large" variant="text"
                    onClick={() => {
                        onBack();
                    }}
                    color={"primary"}
            >back</Button>
            <Button disabled={status.callInProgress && enteredUsername.length > 7} className={"w-fit"} size="large" variant="outlined"
                    onClick={() => {
                        call({username:enteredUsername});
                    }}
                    color={"primary"}
            >Submit</Button>
        </div>
    </div>)
}