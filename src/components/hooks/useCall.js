import {useContext, useEffect, useRef, useState} from "react";
import * as Calls from "../../constants/calls.js";
import {UserContext} from "../../context/userContext.js";

export function useCall(calledMethod, dtoIn, pageInfo) {
    //calledMethod, dtoIn, pageInfo
    const [callInProgress, setCallInProgress] = useState(false);
    const [isError, setIsError] = useState(false);
    const {token} = useContext(UserContext).userContext;
    const [dtoOut, setDtoOut] = useState({});
    const previousError = useRef(isError);
    const calledDtoIn = dtoIn ?? {};
    const calledPageInfo = pageInfo ?? {};

    function resetErr() {
        previousError.current = isError;
        setIsError(false);
    }

    useEffect(() => {
        if (!callInProgress && !isError) {
            setCallInProgress(true);
            Calls[calledMethod](calledDtoIn, calledPageInfo, token).then((response) => {
                setCallInProgress(false);
                setDtoOut(response);
            }).catch((err) => {
                setCallInProgress(false);
                setIsError(true);
                previousError.current = isError;
            });
        }
    }, [calledMethod, dtoIn, isError, pageInfo, token]);

    return {
        dtoOut: dtoOut,
        status: {callInProgress, isError},
        resetErr
    }
}