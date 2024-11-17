import {useFetchCall} from "../../hooks/useFetchCall.js";
import {ConversationUI} from "../visual/ConversationUI.jsx";

export default function ConversationWidget({coversationId}){
    const {dtoOut, status, resetErr} = useFetchCall("getConversation", null, null);

    return <ConversationUI status={status} conversation={dtoOut} reseErr={resetErr}/>
}