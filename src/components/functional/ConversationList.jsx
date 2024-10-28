import {useAccumulatedList} from "../hooks/useAccumulatedList.js";
import {ConversationListUI} from "../visual/ConversationListUI.jsx";
import {useState} from "react";

export function ConversationList() {
    const [pageInfo, setPageInfo] = useState({pageIndex: 0, pageSize: 50});
    const {resultingList, status, resetErr} = useAccumulatedList('listUserConversation', {}, pageInfo);

    function handleOnLoadMore() {
        if (status.isError && !status.callInProgress) {
            resetErr();
            setPageInfo({pageIndex: 0, pageSize: 50});
        }

        if (!status.callInProgress) {
            setPageInfo(() => pageInfo + 1);
        }
    }

    console.log(resultingList);
    return <ConversationListUI status={status} conversations={resultingList} handleOnLoadMore={handleOnLoadMore}/>
}