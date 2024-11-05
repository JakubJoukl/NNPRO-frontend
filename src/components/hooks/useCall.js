import {useContext, useEffect, useState} from "react";
import * as Calls from "../../constants/calls.js";
import {UserContext} from "../../context/userContext.js";

export function useCall(calledMethod, dtoIn, pageInfo) {
    const [userInfo, setUserInfo] = useState({});
    const [callInProgress, setCallInProgress] = useState(false);
    const [isError, setIsError] = useState(false);
    const {token} = useContext(UserContext).userContext;
    const {dtoOut, setDtoOut} = useState({});

    useEffect(() => {
        if (!callInProgress) {
            setCallInProgress(true);
            Calls[calledMethod](dtoIn, pageInfo, token).then((response) => {
                setCallInProgress(false);
                setIsError(false);
                setUserInfo({
                    name: response.username,
                    email: response.email,
                    publicKey: response.publicKey
                })
            }).catch((err) => {
                setCallInProgress(false)
                setIsError(true)
            });
        }
    }, [dtoIn, pageInfo.pageIndex, isError, callInProgress, calledMethod, pageInfo, token]);

    return {
        dtoOut: dtoOut,
        status: {callInProgress, isError},
    }
}