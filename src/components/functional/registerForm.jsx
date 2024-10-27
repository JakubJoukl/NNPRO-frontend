import * as Calls from "../../constants/calls.js";
import {useContext, useState} from "react";
import RegisterFormUI from "../visual/registerFormUI.jsx";
import {GlobalAlertContext} from "../../context/globalAlertContext.js";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
    const [callInProgress, setCallInProgress] = useState(false);
    const {openAlert} = useContext(GlobalAlertContext);
    const navigate = useNavigate();

    function register(username, password, email, captchaToken) {
        if (!callInProgress) {
            setCallInProgress(true)
            Calls.register({username, password, email, captchaToken}).then((dtoOut) => {
                    //setCallInProgress(false); we actually want to wait for user to be redirected.
                    openAlert("Registration successful. You can now login.");
                    navigate("/");
                }
            ).catch((err) => {
                setCallInProgress(false)
                openAlert("Unknown error occurred during registration", "error");
            });
        }
    }

    return <RegisterFormUI onSubmit={register} disableRegisterButton={callInProgress}/>
}

export default RegisterForm;