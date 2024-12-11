import {Button, TextField, Typography} from "@mui/material";
import {useSubmitCall} from "../../hooks/useSubmitCall.js";
import {useContext, useState} from "react";
import {GlobalAlertContext} from "../../context/globalAlertContext.js";

export function EnterCode({onBack}) {
    // Fixme recapcha
    const {status, call} = useSubmitCall(
        "newPassword", "Password has been reset successfully",
        "Resetting of password failed. Is the code correct?"
    );
    const {openAlert} = useContext(GlobalAlertContext);
    const [enteredUsername, setEnteredUsername] = useState("");
    const [enteredCode, setEnteredCode] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const [enteredPassword2, setEnteredPassword2] = useState("");
    const [typingTimeouts, setTypingTimeouts] = useState({});

    // True means valid, false means invalid
    const [validations, setValidations] = useState({
        enteredPassword: true,
        enteredPassword2: true,
    });

    function validate(changedKey, targetValue) {
        let passwordIsValid = validations.enteredPassword;
        let password2IsValid = validations.enteredPassword2;

        switch (changedKey) {
            case "enteredPassword":
                passwordIsValid = targetValue?.length >= 12;
                break;
            case "enteredPassword2":
                password2IsValid = targetValue === enteredPassword;
                break;
            default:
                //all - so we have no target value... should not be used in onChange as the state change is not guaranteed to be on time of validation...
                passwordIsValid = enteredPassword?.length >= 12;
                password2IsValid = enteredPassword === enteredPassword2;
                break;
        }

        setValidations({
            enteredPassword: passwordIsValid,
            enteredPassword2: password2IsValid,
        });
        return {
            enteredPassword: passwordIsValid,
            enteredPassword2: password2IsValid,
        };
    }

    function validateWithTimeout(changedKey, value) {
        if (typingTimeouts[changedKey]) clearTimeout(typingTimeouts[changedKey]);
        // Set a new timeout for delayed validation
        const timeoutId = setTimeout(() => {
            validate(changedKey, value);
        }, 500);
        // Update the timeout ID for this specific input
        setTypingTimeouts((prevTimeouts) => ({...prevTimeouts, [changedKey]: timeoutId}));
    }

    return (<div className={"!space-y-3 flex flex-col"}>
            <Typography variant="p" gutterBottom>
                Enter reset code which arrived to your mail address.
            </Typography>
            <TextField
                value={enteredUsername}
                id="username"
                label="Username"
                variant="filled"
                className={"w-full"}
                onChange={(e) => {
                    setEnteredUsername(e.target.value);
                }}
            />
            <TextField value={enteredCode}
                       id="code"
                       label="Reset code" variant="filled" className={"w-full"}
                       onChange={(e) => {
                           setEnteredCode(e.target.value);
                       }}
            />
            <TextField value={enteredPassword}
                       id="password"
                       type="password"
                       label="New password" variant="filled" className={"w-full"}
                       error={!(validations.enteredPassword)}
                       helperText={!(validations.enteredPassword) && "Password must be longer than 12 characters."}
                       onChange={(e) => {
                           setEnteredPassword(e.target.value);
                           validateWithTimeout("enteredPassword", e.target.value);
                       }}
            />
            <TextField value={enteredPassword2}
                       id="password2"
                       type="password"
                       label="Repeat password" variant="filled" className={"w-full"}
                       helperText={!(validations.enteredPassword2) && "Entered password does not match"}
                       error={!(validations.enteredPassword2)}
                       onChange={(e) => {
                           setEnteredPassword2(e.target.value);
                           validateWithTimeout("enteredPassword2", e.target.value);
                       }}
            />
            <div className={"flex flex-row justify-around"}>
                <Button className={"w-fit"} size="large" variant="text"
                        onClick={() => {
                            onBack()
                        }}
                        color={"primary"}
                >back</Button>
                <Button disabled={status.callInProgress} className={"w-fit"} size="large" variant="outlined"
                        onClick={() => {
                            if (validations.enteredPassword && validations.enteredPassword2) {
                                //handleReCaptchaVerify().then(() => {
                                call({username: enteredUsername, password: enteredPassword, token: enteredCode});
                                //});
                            } else {
                                openAlert("Password is not filled correctly.", "error")
                            }
                        }}
                        color={"primary"}
                >Submit</Button>
            </div>
        </div>
    )
}