import {useContext, useEffect, useRef, useState} from "react";
import * as Calls from "../../constants/calls.js";
import {UserContext} from "../../context/userContext.js";

// This expects pageSize to increase only, so no previous elements are loaded
// Fixme - remove duplicates by id.... maybe....
export function useAccumulatedList(calledMethod, dtoIn, pageInfo) {
    const [callInProgress, setCallInProgress] = useState(false);
    const [resultingList, setResultingList] = useState({
        itemList: [],
        total: 999999999 // so it is always called
    });
    const {token} = useContext(UserContext).userContext;
    const [isError, setIsError] = useState(false);
    const previousPageInfo = useRef({});
    const previousError = useRef(isError);

    function resetErr() {
        previousError.current = isError;
        previousPageInfo.current = {};
        setIsError(false);
    }

    function loadMore() {
        if (!callInProgress && !isError &&
            (previousError.current !== isError || (previousPageInfo.current.pageSize !== pageInfo.pageSize && previousPageInfo.current.pageIndex !== pageInfo.pageIndex))
        ) {
            setCallInProgress(true);
            Calls[calledMethod](dtoIn ?? {}, pageInfo, token).then((response) => {
                setResultingList((prevState) => {
                    let itemList;
                    itemList = response.itemList.filter((item) => !prevState.itemList.some((prevItem) => prevItem.id !== item.id));
                    return {
                        itemList: [...(prevState.itemList), ...(itemList)],
                        total: response?.pageInfo?.total ?? 0
                    }
                });
                setCallInProgress(false);
                previousPageInfo.current = pageInfo;
            }).catch((err) => {
                setCallInProgress(false);
                previousError.current = isError;
                setIsError(true);
                setResultingList({
                    itemList: [],
                    total: 999999999 // so it is always called
                });
            });
        }
    }

    useEffect(() => {
        loadMore()
    }, [pageInfo.pageIndex, isError, calledMethod]);

    return {
        resultingList: resultingList.itemList,
        status: {callInProgress, isError, hasMore: resultingList.total > (pageInfo.pageIndex + 1 * pageInfo.pageSize)},
        resetErr
    }
}