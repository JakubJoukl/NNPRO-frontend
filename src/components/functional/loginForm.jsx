import LoginFormUI from "../visual/loginFormUI.jsx";
import * as Calls from "../../constants/calls.js";
import {useContext, useState} from "react";
import {GlobalAlertContext} from "../../context/globalAlertContext.js";
import MailCodeVerificationUI from "../visual/mailCodeVerificationUI.jsx";
import {jwtDecode} from "jwt-decode";

function LoginForm({setLoggedUser}) {
    const [callInProgress, setCallInProgress] = useState(false);
    // With this we also verify that we have token
    const [tokenExpirationDate, setTokenExpirationDate] = useState(null);
    const [username, setUsername] = useState('');

    const {openAlert, closeAlert} = useContext(GlobalAlertContext);

    function handleCancel2FA() {
        setTokenExpirationDate(null);
        setUsername(null);
    }

    //use call TODO HOOK!!
    function login(username, password, captchaToken) {
        if (!callInProgress) {
            closeAlert();
            setCallInProgress(true);
            Calls.login({username, password, captchaToken}).then((response) => {
                setTokenExpirationDate(response?.expirationDate);
                setUsername(username);
                setCallInProgress(false);
            }).catch((err) => {
                setCallInProgress(false)

                if (err.message === "unauthorized") {
                    if (openAlert) {
                        openAlert("Invalid credentials. Try again.", "error");
                    }
                } else {
                    if (openAlert) {
                        openAlert("Unknown error occurred during login. If problem persists, contact support.", "error");
                    }
                }
            });
        }
    }

    async function submit2Fa(otp, captchaToken) {
        if (!callInProgress) {
            setCallInProgress(true);
            closeAlert();
            try {
                const tokenDtoOut = await Calls.verify2fa({username, verificationCode: otp, captchaToken})
                const token = tokenDtoOut?.jwtToken;
                const decodedToken = jwtDecode(token);
                const currentUserProfile = await Calls.getCurrentUserProfile({}, {}, token);
                setLoggedUser({
                    username: currentUserProfile.username,
                    token,
                    publicKey: currentUserProfile.publicKey,
                    userRoles: decodedToken?.authorities ?? [] //FIXME default array should be empty
                });
                closeAlert();
                setCallInProgress(false);
            } catch (err) {
                setCallInProgress(false);
                if (err.message === "unauthorized") {
                    if (openAlert) {
                        openAlert("Invalid 2FA code. Try again.", "error");
                    }
                } else {
                    if (openAlert) {
                        openAlert("Unknown error occurred. Try again. If problem persists, contact support.", "error");
                    }
                }
            }
        }
    }

    if (!tokenExpirationDate) {
        return <LoginFormUI onSubmit={login} disableLoginButton={callInProgress}/>
    } else {
        return <MailCodeVerificationUI onSubmit={submit2Fa} disableSubmit={callInProgress}
                                       callInProgress={callInProgress} cancel2FA={handleCancel2FA}/>
    }
}

export default LoginForm;