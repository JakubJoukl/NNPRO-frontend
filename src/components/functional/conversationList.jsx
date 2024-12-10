import {ConversationListUI} from "../visual/ConversationListUI.jsx";
import {useContext, useMemo, useState} from "react";
import {ConversationContext} from "../../context/conversationContext.js";
import {useSubscription} from "react-stomp-hooks";
import {UserContext} from "../../context/userContext.js";
import {useFetchCall} from "../../hooks/useFetchCall.js";

export function ConversationList() {
    const [pageInfo, setPageInfo] = useState({pageIndex: 0, pageSize: 50});
    const inputDtoIn = useMemo(() => {
        return {}
    }, []);
    const pageInfoMemo = useMemo(() => {
        return {pageInfo}
    }, [pageInfo]);
    const {dtoOut, status, resetErr} = useFetchCall('listUserConversation', inputDtoIn, pageInfo, updateConversations);
    const {conversations, setConversations} = useContext(ConversationContext);
    const {userContext} = useContext(UserContext);

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

    function updateConversations(response) {
        setConversations((prevState) => {
            return [...(response?.itemList ?? []), ...prevState].reduce((acc, conversation) => {
                if (!acc.some(existingConversation => existingConversation.id === conversation.id)) {
                    acc.push(conversation);
                }
                return acc;
            }, []);
        });
    }

    useSubscription(`/topic/newConversation/${userContext.username}`, async (message) => {
        setConversations((prevState) => {
            if (prevState.some(conversation => conversation.id === JSON.parse(message.body).id)) {
                return prevState; // conversation is already present in list
            }
            return [...prevState, JSON.parse(message.body)];
        });
    });

    return <ConversationListUI status={status} conversations={conversations} handleOnLoadMore={handleOnLoadMore}/>
}