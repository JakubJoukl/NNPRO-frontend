import {useSubmitCall} from "../../hooks/useSubmitCall.js";
import {LeaveConversationBodyUI} from "../visual/leaveConversationBodyUI.jsx";
import {useNavigate} from "react-router-dom";

export function LeaveConversationBody(conversation, onSubmit) {
    const navigate = useNavigate();

    const {status, call} = useSubmitCall(
        "leaveConversation", "Conversation has been left successfully",
        "Leaving conversation failed",
        finishLeave
    );

    async function leaveConversation() {
        call({
            conversationId: conversation.conversationId,
        });
    }

    function finishLeave() {
        onSubmit();
        navigate("/");
    }

    return (<LeaveConversationBodyUI conversation={conversation} onSubmit={leaveConversation} status={status}/>);
}