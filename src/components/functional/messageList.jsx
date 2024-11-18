import {useRef, useState} from "react";
import {useAccumulatedList} from "../../hooks/useAccumulatedList.js";
import MessageBody from "../visual/MessageBody.jsx";
import { useSubscription } from "react-stomp-hooks";


export function MessageList({conversationId}) {
    const [pageInfo, setPageInfo] = useState({pageIndex: 0, pageSize: 50});
    // Will always remain same
    const sendDto = useRef({to: new Date().toISOString(), conversationId});
    const {resultingList, status, resetErr} = useAccumulatedList('listMessages', sendDto.current, pageInfo, "id");
    const [lastMessage, setLastMessage] = useState("No message received yet");


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
    useSubscription(`/topic/${conversationId}`, (message) => console.log(message));


    return <MessageBody handleOnLoadMore={handleOnLoadMore} status={status} messages={resultingList}/>;
}