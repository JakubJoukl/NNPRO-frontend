import ConversationWidget from "../components/functional/conversationWidget.jsx";
import { useParams } from 'react-router-dom';

export function ConversationRoute() {
    let {id} = useParams();

    return <div className={"text-center space-y-3"}>
        <ConversationWidget coversationId={id}/>
    </div>
}