import {useContext, useState} from "react";
import {useAccumulatedList} from "../hooks/useAccumulatedList.js";
import {ContactsListUI} from "../visual/ContactsListUI.jsx";

export default function NewConversationWidget({onUserClicked, deleteEnabled}) {
    const [pageInfo, setPageInfo] = useState({pageIndex: 0, pageSize: 50});
    const [filteredName, setFilteredName] = useState("");
    const {resultingList, status, resetErr} = useAccumulatedList('listContacts', {username: filteredName}, pageInfo, "username");

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

    return <ContactsListUI status={status} contacts={resultingList} handleOnLoadMore={handleOnLoadMore} deleteEnabled={false} setFilteredName={setFilteredName} handleOnClick={onUserClicked}/>
}