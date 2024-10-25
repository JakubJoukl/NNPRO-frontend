import * as Calls from "../../constants/calls.js";
import {useState} from "react";
import withAlert from "./withAlert.jsx";
import RegisterFormUI from "../visual/registerFormUI.jsx";

function RegisterForm({openAlert, closeAlert}) {
    const [callInProgress, setCallInProgress] = useState(false);

    function register(username, password, email) {
        if (!callInProgress) {
            setCallInProgress(true)
            console.log(username, password, email);
            Calls.register({username, password, email}).then((dtoOut) => {
                    setCallInProgress(false);
                    closeAlert()
                }
            ).catch((err) => {
                setCallInProgress(false)
                openAlert("Unknown error occurred during registration", "error");
            });
        }
    }

    return <RegisterFormUI onSubmit={register} disableLoginButton={callInProgress}/>
}

export default withAlert(RegisterForm);