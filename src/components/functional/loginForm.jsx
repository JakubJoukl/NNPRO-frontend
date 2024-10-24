import LoginFormUI from "../visual/loginFormUI.jsx";
import * as Calls from "../../constants/calls.js";
import {jwtDecode} from "jwt-decode";
import PopUpAlert from "../visual/popUpAlert.jsx";
import {useState} from "react";

export default function LoginForm({setLoggedUser}) {
    const [isErr, setIsErr] = useState(false);
    const [callInProgress, setCallInProgress] = useState(false);

    function handleClose() {
        setIsErr(() => false);
    }


    function login(username, password) {
        setIsErr(false);
        setLoggedUser(true);
        Calls.login(username, password).then((token) => {
                // Decode the token to get the payload
                const decodedToken = jwtDecode(token);

                // Extract the username
                const username = decodedToken.sub;  // 'sub' usually holds the username in JWT tokens
                setLoggedUser({username, token});
                setCallInProgress(false);
            }
        ).catch((err) => {
            setCallInProgress(false)
            setIsErr(true);
            if (err.message === "unauthorized") {
                //TODO different message
            } else {
                //TODO different message
            }
        });
    }

    return <>
        <PopUpAlert open={isErr} message={"Error occured during login"} severity={"error"} handleClose={handleClose}/>
        <LoginFormUI onSubmit={login} disableLoginButton={callInProgress}/>
    </>
}