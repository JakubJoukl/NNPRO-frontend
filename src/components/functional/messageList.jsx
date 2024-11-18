import {useContext, useEffect, useRef, useState} from "react";
import {useAccumulatedList} from "../../hooks/useAccumulatedList.js";
import MessageBody from "../visual/MessageBody.jsx";
import {BASE_ADDRESS} from "../../constants/calls.js";
import {UserContext} from "../../context/userContext.js";

export function MessageList() {
    const [pageInfo, setPageInfo] = useState({pageIndex: 0, pageSize: 50});
    const {resultingList, status, resetErr} = useAccumulatedList('listMessages', {}, pageInfo, "id");
    const [webSocketMessages, setWebSocketMessages] = useState([]);
    const {token} = useContext(UserContext).userContext;

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

    //wss://${BASE_ADDRESS}/chat
    //wss://ws.ifelse.io
    useEffect(() => {
        const socket = new WebSocket(`wss://ws.ifelse.io`);
        //, ["Authorization", token]);

        socket.onopen = () => {
            console.log('WebSocket connection established.');
        };

        socket.onmessage = (event) => {
            const receivedMessage = event
            console.log(receivedMessage);
            setWebSocketMessages([...webSocketMessages, receivedMessage]);
        };

        return () => {
            socket.close();
        };
    }, [webSocketMessages]);

    return <MessageBody handleOnLoadMore={handleOnLoadMore} status={status} messages={resultingList}/>;
}