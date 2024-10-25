import LoginFormUI from "../visual/loginFormUI.jsx";
import * as Calls from "../../constants/calls.js";
import {jwtDecode} from "jwt-decode";
import {useState} from "react";
import withAlert from "./withAlert.jsx";

function LoginForm({setLoggedUser, openAlert, closeAlert}) {
    const [callInProgress, setCallInProgress] = useState(false);

    function login(username, password) {
        if (!callInProgress) {
            setCallInProgress(true)
            Calls.login(username, password).then((token) => {
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
                    openAlert("Error occured during login", "error");
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

export default withAlert(LoginForm);