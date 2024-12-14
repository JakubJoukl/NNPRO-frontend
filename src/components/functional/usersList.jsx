import {useAccumulatedList} from "../../hooks/useAccumulatedList.js";
import {useState} from "react";
import {UsersListUI} from "../visual/UsersListUI.jsx";

export function UsersList({ handleOnAddContact, addedContacts}) {
    const [pageInfo, setPageInfo] = useState({pageIndex: 0, pageSize: 50});
    const [searchString, setSearchString] = useState("");
    const {
        resultingList,
        status,
        resetErr
    } = useAccumulatedList('searchUsers', {username: searchString}, pageInfo, "username");
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

    return <UsersListUI status={status} usersList={resultingList} handleOnLoadMore={handleOnLoadMore}
                        setFilteredName={setSearchString} handleOnAddContact={handleOnAddContact} addedContacts={addedContacts}/>
}