import ConversationWidget from "../components/functional/conversationWidget.jsx";
import { useParams } from 'react-router-dom';

export function ConversationRoute() {
    let {id} = useParams();

    return <div className={"text-center flex flex-col flex-grow overflow-auto "}>
        <ConversationWidget conversationId={id}/>
    </div>
}