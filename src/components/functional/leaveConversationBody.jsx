import {useSubmitCall} from "../../hooks/useSubmitCall.js";
import {LeaveConversationBodyUI} from "../visual/leaveConversationBodyUI.jsx";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {ConversationContext} from "../../context/conversationContext.js";

export function LeaveConversationBody({conversation, onSubmit}) {
    const navigate = useNavigate();
    const {setConversations} = useContext(ConversationContext);

    const {status, call} = useSubmitCall(
        "leaveConversation", "Conversation has been left successfully",
        "Leaving conversation failed",
        finishLeave
    );

    async function leaveConversation() {
        await call({
            conversationId: conversation.conversationId,
        });
    }

    function finishLeave() {
        setConversations((prevState) => {
            const newState = prevState.filter((iteratedConversation) => iteratedConversation.id !== conversation.conversationId);
            return[
                ...newState
            ]
        });
        onSubmit();
        navigate("/");
    }

    return (<LeaveConversationBodyUI conversation={conversation} onSubmit={leaveConversation} status={status}/>);
}