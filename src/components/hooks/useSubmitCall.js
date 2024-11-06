import {useContext, useRef, useState} from "react";
import * as Calls from "../../constants/calls.js";
import {UserContext} from "../../context/userContext.js";
import {GlobalAlertContext} from "../../context/globalAlertContext.js";

export function useSubmitCall(calledMethod, successMessage, errorMessage) {
    const [callInProgress, setCallInProgress] = useState(false);
    const isError = useRef(false);
    const {token} = useContext(UserContext).userContext;
    const dtoOut = useRef({});
    const {openAlert, closeAlert} = useContext(GlobalAlertContext);

    function call(dtoIn, pageInfo) {
        if (successMessage || errorMessage) {
            closeAlert();
        }
        if (!callInProgress) {
            setCallInProgress(true);
            Calls[calledMethod](dtoIn, pageInfo, token).then((response) => {
                setCallInProgress(false);
                dtoOut.current = response;
                if (successMessage) {
                    openAlert(successMessage);
                }
            }).catch((err) => {
                setCallInProgress(false);
                isError.current = true;
                if (errorMessage) {
                    openAlert(errorMessage, "error");
                }
            });
        }
    }

    return {
        dtoOut: dtoOut,
        status: {callInProgress, isError: isError.current},
        call
    }
}