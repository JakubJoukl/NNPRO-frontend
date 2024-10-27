import LoginFormUI from "../visual/loginFormUI.jsx";
import * as Calls from "../../constants/calls.js";
import {jwtDecode} from "jwt-decode";
import {useContext, useState} from "react";
import {GlobalAlertContext} from "../../context/globalAlertContext.js";

function LoginForm({setLoggedUser}) {
    const [callInProgress, setCallInProgress] = useState(false);
    const [verificationCode, setVerificationCode] = useState(false);

    const {openAlert, closeAlert} = useContext(GlobalAlertContext);

    function login(username, password, recaptchaToken) {
        if (!callInProgress) {
            setCallInProgress(true)
            Calls.login(username, password, recaptchaToken).then((response) => {
                    setVerificationCode(response?.verificationCode);
                }
            ).catch((err) => {
                setCallInProgress(false)
                if (openAlert) {
                    openAlert("Unknown error occurred during login", "error");
                }
                if (err.message === "unauthorized") {
                    //TODO different message
                } else {
                    //TODO different message
                }
            });
        }
    }

    function submit2Fa(username, password, recaptchaToken) {
        if (!callInProgress) {
            setCallInProgress(true)
            Calls.login(username, password, recaptchaToken).then((response) => {
                    setVerificationCode(response?.verificationCode);
                }
            ).catch((err) => {
                setCallInProgress(false)
                if (openAlert) {
                    openAlert("Unknown error occurred during login", "error");
                }
                if (err.message === "unauthorized") {
                    //TODO different message
                } else {
                    //TODO different message
                }
            });
        }
    }

    if (!verificationCode) {
        return <LoginFormUI onSubmit={login} disableLoginButton={callInProgress}/>
    } else {
        return <MailCodeVerificationUI onSubmit={submit2Fa} disableVerificationCalls={callInProgress}/>
    }
}

export default LoginForm;