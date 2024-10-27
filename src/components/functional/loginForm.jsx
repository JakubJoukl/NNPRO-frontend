import LoginFormUI from "../visual/loginFormUI.jsx";
import * as Calls from "../../constants/calls.js";
import {jwtDecode} from "jwt-decode";
import {useContext, useState} from "react";
import {GlobalAlertContext} from "../../context/globalAlertContext.js";

function LoginForm({setLoggedUser}) {
    const [callInProgress, setCallInProgress] = useState(false);
    const {openAlert, closeAlert} = useContext(GlobalAlertContext);

    function login(username, password, recaptchaToken) {
        if (!callInProgress) {
            setCallInProgress(true)
            Calls.login(username, password, recaptchaToken).then((token) => {
                    // Decode the token to get the payload
                    const decodedToken = jwtDecode(token);
                    // Extract the username
                    const username = decodedToken.sub;  // 'sub' usually holds the username in JWT tokens
                    setCallInProgress(false);
                    closeAlert();
                    setLoggedUser({username, token});
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

    return <LoginFormUI onSubmit={login} disableLoginButton={callInProgress}/>
}

export default LoginForm;