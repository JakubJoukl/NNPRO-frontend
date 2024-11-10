import {useContext, useEffect, useRef, useState} from "react";
import * as Calls from "../../constants/calls.js";
import {UserContext} from "../../context/userContext.js";

export function useFetchCall(calledMethod, dtoIn, pageInfo) {
    //calledMethod, dtoIn, pageInfo
    const [callInProgress, setCallInProgress] = useState(false);
    const isError = useRef(false);
    const {token} = useContext(UserContext).userContext;
    const [dtoOut, setDtoOut] = useState({});
    const calledDtoIn = dtoIn ?? {};
    const calledPageInfo = pageInfo ?? {};

    function resetErr() {
        isError.current = false;
        fetch();
    }

    function fetch() {
        if (!callInProgress) {
            setCallInProgress(true);
            Calls[calledMethod](calledDtoIn, calledPageInfo, token).then((response) => {
                setCallInProgress(false);
                setDtoOut(response);
            }).catch((err) => {
                setDtoOut({});
                setCallInProgress(false);
                isError.current = true;
            });
        }
    }

    useEffect(() => {
        fetch();
    }, [calledMethod, dtoIn, pageInfo, token]);

    console.log("pre", dtoOut);
    return {
        dtoOut,
        status: {callInProgress, isError: isError.current},
        resetErr
    }
}