import {useContext, useState} from "react";
import {useAccumulatedList} from "../../hooks/useAccumulatedList.js";
import MessageBody from "../visual/MessageBody.jsx";

export function MessageList() {
    const [pageInfo, setPageInfo] = useState({pageIndex: 0, pageSize: 50});
    const {resultingList, status, resetErr} = useAccumulatedList('listMessages', {}, pageInfo, "id");

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

    /*
    const finalConversations = [...resultingList, ...addedConversations].reduce((acc, conversation) => {
        if (!acc.some(existingConversation => existingConversation.id === conversation.id)) {
            acc.push(conversation);
        }
        return acc;
    }, []);

     */

    return <MessageBody handleOnLoadMore={handleOnLoadMore} status={status} messages={resultingList} />;
}