import {GroupConversationUI} from "../visual/GroupConversationUI.jsx";
import {useAccumulatedList} from "../../hooks/useAccumulatedList.js";
import {useState} from "react";

export function GroupConversation({status, onSubmit}) {
    const [pageInfo, setPageInfo] = useState({pageIndex: 0, pageSize: 50});
    const [filterName, setFilterName] = useState("");
    const {
        resultingList,
        status: listStatus,
        resetErr
    } = useAccumulatedList('listContacts', {username: filterName}, pageInfo, "username");

    function handleOnLoadMore() {
        if (listStatus.isError && !listStatus.callInProgress) {
            resetErr();
            setPageInfo({pageIndex: 0, pageSize: 50});
        } else if (!listStatus.callInProgress) {
            setPageInfo((previousPageInfo) => {
                return {
                    ...previousPageInfo,
                    pageIndex: previousPageInfo.pageIndex + 1,
                }
            });
        }
    }

    return (<GroupConversationUI status={listStatus} onSubmit={onSubmit} setFilterName={setFilterName} contacts={resultingList} handleOnLoadMore={handleOnLoadMore}/>);
}