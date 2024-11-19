import {useContext, useEffect, useMemo, useRef, useState} from "react";
import {useAccumulatedList} from "../../hooks/useAccumulatedList.js";
import MessageListUI from "../visual/MessageBody.jsx";
import {useSubscription} from "react-stomp-hooks";
import {UserContext} from "../../context/userContext.js";
import {decryptDataBySymetricKey} from "../helpers/cryptographyHelper.js";
import {useFetchCall} from "../../hooks/useFetchCall.js";

export function MessageList({conversationId, decryptedKey}) {
    const [pageInfo, setPageInfo] = useState({pageIndex: 0, pageSize: 50});
    const {userContext} = useContext(UserContext);
    // Will always remain same
    const memoDtoIn = useMemo(() => {
        return {to: new Date().toISOString(), conversationId}
    }, [conversationId]);
    const {
        dtoOut,
        status,
        resetErr
    } = useFetchCall('listMessages', memoDtoIn, pageInfo);
    const [lastMessage, setLastMessage] = useState({});
    const [resultingList, setResultingList] = useState([]);
    const prevConversationId = useRef(conversationId);


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

    useEffect(() => {
        (async () => {
            const newMessages = await Promise.all(dtoOut?.itemList?.map((async message => {
                let decryptedContent = null;
                let isError = false;
                try {
                    decryptedContent = await decryptDataBySymetricKey(decryptedKey, message.message, message.iv);
                } catch (e) {
                    console.log(e);
                    isError = true;
                }
                return {
                    ...message,
                    decrypted: !isError,
                    message: isError ? message.message : decryptedContent,
                }
            })) ?? []);

            if (prevConversationId.current !== conversationId) {
                prevConversationId.current = conversationId;
                return newMessages ?? [];
            }

            if (newMessages.length === 0) {
                return;
            }
            setResultingList((prevState) => [...resultingList, ...newMessages.filter((newMessage) => !prevState.some(prevMessage => prevMessage.id === newMessage.id))]);
        })();
    }, [dtoOut?.itemList, decryptedKey, conversationId]);
    /*
    const finalConversations = [...resultingList, ...addedConversations].reduce((acc, conversation) => {
        if (!acc.some(existingConversation => existingConversation.id === conversation.id)) {
            acc.push(conversation);
        }
        return acc;
    }, []);

     */
    useSubscription(`/topic/${conversationId}`, (message) => console.log(message, "received message!"));

    return <MessageListUI handleOnLoadMore={handleOnLoadMore} status={status} messages={resultingList}/>;
}