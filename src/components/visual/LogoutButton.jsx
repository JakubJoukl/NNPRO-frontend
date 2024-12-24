import {Button} from "@mui/material";
import * as React from "react";
import {useSubmitCall} from "../../hooks/useSubmitCall.js";
import {useContext} from "react";
import {UserContext} from "../../context/userContext.js";
import {useNavigate} from "react-router-dom";

export function LogoutButton() {
    const {status, call, dtoOut} = useSubmitCall(
        "logout", "You have been logged out.",
        "Logging off failed due to unknown error.",
        onLogoutDone
    );
    const {setUserContext} = useContext(UserContext);
    const navigate = useNavigate();

    function onLogoutDone() {
        console.log("done");
        setUserContext({});
        navigate("/");
    }

    return (<Button
        disabled={status.callInProgress}
        onClick={() => {
            call({});
        }
        }
        variant={"contained"} color={"secondary"}
    >Logout</Button>)
}