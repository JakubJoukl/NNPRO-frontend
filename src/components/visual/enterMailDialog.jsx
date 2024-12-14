import {Button, TextField, Typography} from "@mui/material";
import {useSubmitCall} from "../../hooks/useSubmitCall.js";
import {useCallback, useEffect, useRef, useState} from "react";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";

export function EnterMail({onBack}) {
    const {executeRecaptcha} = useGoogleReCaptcha();
    const tokenRef = useRef('');
    // Create an event handler so you can call the verification on button click event or form submit
    const handleReCaptchaVerify = useCallback(async () => {
        if (!executeRecaptcha) {
            console.log('Execute recaptcha not yet available');
            return;
        }

        tokenRef.current = await executeRecaptcha('resetPassMail');
        // Do whatever you want with the token
    }, [executeRecaptcha]);

    // You can use useEffect to trigger the verification as soon as the component being loaded
    useEffect(() => {
        handleReCaptchaVerify();
    }, [handleReCaptchaVerify]);

    const {status, call} = useSubmitCall(
        "resetPassword",
        "Code has been send to your mail. Next step is to enter reset code.",
        "Sending of reset code has failed. Is entered username correct?",
        callback
    );

    function callback(){
        onBack();
    }

    const [enteredUsername, setEnteredUsername] = useState("");
    return (<div className={"!space-y-3 flex flex-col"}>
        <Typography variant="p" gutterBottom>
            Enter your username. We will send you reset code to your mail.
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
            <Button disabled={status.callInProgress && enteredUsername.length > 7} className={"w-fit"} size="large"
                    variant="outlined"
                    onClick={() => {
                        handleReCaptchaVerify().then(() => {
                            return call({username: enteredUsername, captchaToken: tokenRef.current});
                        });
                    }}
                    color={"primary"}
            >Submit</Button>
        </div>
    </div>)
}