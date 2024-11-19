import {useContext, useEffect, useRef, useState} from "react";
import * as Calls from "../constants/calls.js";
import {UserContext} from "../context/userContext.js";

export function useFetchCall(calledMethod, dtoIn, pageInfo, callback) {
    //calledMethod, dtoIn, pageInfo
    const [callInProgress, setCallInProgress] = useState(false);
    const isError = useRef(false);
    const {token} = useContext(UserContext).userContext;
    const [dtoOut, setDtoOut] = useState({});
    const calledDtoIn = dtoIn ?? {};
    const calledPageInfo = pageInfo ?? {};
    const [callFinished, setCallFinished] = useState(false);

    function resetErr() {
        isError.current = false;
        setCallFinished(false);
        fetch();
    }

    function fetch() {
        setCallFinished(false);
        if (!callInProgress) {
            setCallInProgress(true);
            Calls[calledMethod](calledDtoIn, calledPageInfo, token).then((response) => {
                setCallInProgress(false);
                setCallFinished(true);
                setDtoOut(response);
                if (callback) {
                    callback(response);
                }
            }).catch((err) => {
                setDtoOut({});
                setCallInProgress(false);
                isError.current = true;
                setCallFinished(false);
            });
        }
    }

    useEffect(() => {
        fetch();
    }, [dtoIn, pageInfo, token]);
    return {
        dtoOut,
        status: {callInProgress, isError: isError.current, callFinished: callFinished},
        resetErr
    }
}