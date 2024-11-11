import {useAccumulatedList} from "../hooks/useAccumulatedList.js";
import {ConversationListUI} from "../visual/ConversationListUI.jsx";
import {useState} from "react";

export function ConversationList() {
    const [pageInfo, setPageInfo] = useState({pageIndex: 0, pageSize: 50});
    const {resultingList, status, resetErr} = useAccumulatedList('listUserConversation', {}, pageInfo, "id");

    function handleOnLoadMore() {
        if (status.isError && !status.callInProgress) {
            resetErr();
            setPageInfo({pageIndex: 0, pageSize: 50});
        } else if (!status.callInProgress) {
            setPageInfo((previousPageInfo) => {
                return {
                    ...previousPageInfo,
                    pageIndex: previousPageInfo.pageIndex + 1,
                }
            });
        }
    }

    return <ConversationListUI status={status} conversations={resultingList} handleOnLoadMore={handleOnLoadMore}/>
}