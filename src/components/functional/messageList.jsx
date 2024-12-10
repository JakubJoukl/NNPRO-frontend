import {useContext, useEffect, useMemo, useRef, useState} from "react";
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
    const [resultingList, setResultingList] = useState([]);
    const prevConversationId = useRef(conversationId);
    const previousDecryptedKey = useRef(decryptedKey);
    let hasMore = true;
    if (dtoOut && dtoOut.pageInfo) {
        hasMore = dtoOut.pageInfo.pageSize * (dtoOut.pageInfo.pageIndex + 1) < dtoOut.pageInfo.total;
    }


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

    async function _decryptMessage(message) {
        let decryptedContent = null;
        let isError = false;
        try {
            const iv = new Uint8Array(Object.values(message.iv));
            decryptedContent = await decryptDataBySymetricKey(decryptedKey, message.message, iv);
        } catch (e) {
            isError = true;
            console.error(e);
        }
        return {
            ...message,
            decrypted: !isError,
            decryptedMessage: isError ? message.message : decryptedContent,
        }
    }

    useEffect(() => {
        (async () => {
            const newMessages = await Promise.all(dtoOut?.itemList?.map((async message => {
                    return await _decryptMessage(message);
                })) ?? []);

            if (prevConversationId.current !== conversationId) {
                prevConversationId.current = conversationId;
                return newMessages ?? [];
            }

            if (newMessages.length === 0) {
                return;
            }

            if(previousDecryptedKey.current !== decryptedKey){
                previousDecryptedKey.current = decryptedKey;
                const newlyDecrypted = await Promise.all(resultingList?.map((async message => {
                    return await _decryptMessage(message);
                })) ?? []);
                setResultingList((prevState) => [...newlyDecrypted, ...newMessages.filter((newMessage) => !prevState.some(prevMessage => prevMessage.id === newMessage.id))]);
            }
            setResultingList((prevState) => [...prevState, ...newMessages.filter((newMessage) => !prevState.some(prevMessage => prevMessage.id === newMessage.id))]);
        })();
    }, [dtoOut?.itemList, decryptedKey, conversationId]); //resultingList sadly can't be in deps :( - as we also manipulate it by stomp

    useSubscription(`/topic/addMessage/${conversationId}`, async (message) => {
        const decryptedMessage = await _decryptMessage(JSON.parse(message.body));
        setResultingList((prevState) => [decryptedMessage, ...prevState]);
    });

    useSubscription(`/topic/deleteMessage/${conversationId}`, (stompMessage) => {
        setResultingList((prev) => prev.filter(message => message.id !== JSON.parse(stompMessage.body).id));
    });

    return <MessageListUI handleOnLoadMore={handleOnLoadMore} status={status} messages={resultingList}
                          hasMore={hasMore}/>;
}