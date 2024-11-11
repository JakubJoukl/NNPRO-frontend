import {useContext, useEffect, useRef, useState} from "react";
import * as Calls from "../../constants/calls.js";
import {UserContext} from "../../context/userContext.js";

// This expects pageSize to increase only, so no previous elements are loaded
// FIXME - this hook is bad :(((
export function useAccumulatedList(calledMethod, dtoIn, pageInfo, uniqueIndexName) {
    const [callInProgress, setCallInProgress] = useState(false);
    const [resultingList, setResultingList] = useState({
        itemList: [],
        total: 0 // so it is always called
    });
    const {token} = useContext(UserContext).userContext;
    const isError = useRef(false);
    const previousPageInfo = useRef({});
    const previousError = useRef(isError.current);
    const previousDtoIn = useRef(dtoIn);

    function resetErr() {
        previousError.current = isError.current;
        previousPageInfo.current = {};
        isError.current = false;
    }

    function loadMore() {
        if (JSON.stringify(previousDtoIn.current) !== JSON.stringify(dtoIn)) {
            setResultingList({
                itemList: [],
                total: 0 // so it is always called
            });
            previousPageInfo.current = {};
        }
        previousDtoIn.current = dtoIn;
        if (!callInProgress && !isError.current &&
            (previousError.current !== isError.current || (previousPageInfo.current.pageSize !== pageInfo.pageSize || previousPageInfo.current.pageIndex !== pageInfo.pageIndex))
        ) {
            setCallInProgress(true);
            Calls[calledMethod](dtoIn ?? {}, pageInfo, token).then((response) => {

                setResultingList((prevState) => {
                    let itemList;
                    itemList = response.itemList.filter((item) => !prevState.itemList.some((prevItem) => prevItem[uniqueIndexName] === item[uniqueIndexName]));
                    return {
                        itemList: [...(prevState.itemList), ...(itemList)],
                        total: response?.pageInfo?.total ?? 0
                    }
                });
                setCallInProgress(false);
                previousPageInfo.current = pageInfo;
                previousError.current = isError.current;
                isError.current = false;
            }).catch((err) => {
                setCallInProgress(false);
                previousError.current = isError.current;
                isError.current = true;
                setResultingList({
                    itemList: [],
                    total: 0 // so it is always called
                });
            });
        }
    }

    useEffect(() => {
        loadMore();
    }, [pageInfo.pageIndex, isError.current, dtoIn]);

    return {
        resultingList: resultingList.itemList,
        status: {
            callInProgress,
            isError: isError.current,
            hasMore: resultingList.total > (pageInfo.pageIndex + 1 * pageInfo.pageSize)
        },
        resetErr
    }
}