import {useAccumulatedList} from "../hooks/useAccumulatedList.js";
import {useState} from "react";
import {ContactsListUI} from "../visual/ContactsListUI.jsx";

export function ContactsList({displayType}) {
    const [pageInfo, setPageInfo] = useState({pageIndex: 0, pageSize: 50});
    const {resultingList, status, resetErr} = useAccumulatedList('listContacts', {}, pageInfo, "username");

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

    return <ContactsListUI status={status} contacts={resultingList} handleOnLoadMore={handleOnLoadMore} displayType={displayType}/>
}