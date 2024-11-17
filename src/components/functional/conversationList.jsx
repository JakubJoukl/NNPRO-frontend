import {useAccumulatedList} from "../../hooks/useAccumulatedList.js";
import {ConversationListUI} from "../visual/ConversationListUI.jsx";
import {useContext, useState} from "react";
import {AddedConversationContext} from "../../context/AddedConversationContext.js";

export function ConversationList() {
    const [pageInfo, setPageInfo] = useState({pageIndex: 0, pageSize: 50});
    const {resultingList, status, resetErr} = useAccumulatedList('listUserConversation', {}, pageInfo, "id");
    const {addedConversations} = useContext(AddedConversationContext);

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

    // FIXME the CPU is gonna be like: WTF DUDE! - need MEMO
    const finalConversations = [...resultingList, ...addedConversations].reduce((acc, conversation) => {
        if (!acc.some(existingConversation => existingConversation.id === conversation.id)) {
            acc.push(conversation);
        }
        return acc;
    }, []);

    return <ConversationListUI status={status} conversations={finalConversations} handleOnLoadMore={handleOnLoadMore}/>
}