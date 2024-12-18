import {useContext, useEffect, useRef, useState} from "react";
import * as Calls from "../constants/calls.js";
import {UserContext} from "../context/userContext.js";

export function useFetchCall(calledMethod, dtoIn, pageInfo, callback) {
    //calledMethod, dtoIn, pageInfo
    const [callInProgress, setCallInProgress] = useState(false);
    const [isError, setIsError] = useState(false);
    const {token} = useContext(UserContext).userContext;
    const [dtoOut, setDtoOut] = useState({});
    const calledDtoIn = dtoIn ?? {};
    const calledPageInfo = pageInfo ?? {};
    const [callFinished, setCallFinished] = useState(false);

    function resetErr() {
        setIsError(false);
        setCallFinished(false);
        fetch();
    }

    function fetch() {
        if(isError){
            return;
        }
        setCallFinished(false);
        if (!callInProgress) {
            setCallInProgress(true);
            Calls[calledMethod](calledDtoIn, calledPageInfo, token).then((response) => {
                setCallInProgress(false);
                setCallFinished(true);
                setDtoOut(response);
                if (typeof callback === "function") {
                    callback(response);
                }
            }).catch((err) => {
                console.error(err);
                setDtoOut({});
                setCallInProgress(false);
                setIsError(false);
                setCallFinished(false);
            });
        }
    }

    useEffect(() => {
        fetch();
    }, [dtoIn, pageInfo]);
    return {
        dtoOut,
        status: {callInProgress, isError: isError.current, callFinished: callFinished},
        // (dtoOut.itemList) - check if item is array
        hasMore: dtoOut.itemList && dtoOut?.total > ((pageInfo.pageIndex + 1) * pageInfo.pageSize),
        resetErr,
        fetch,
    }
}