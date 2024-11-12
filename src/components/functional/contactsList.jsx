import {useAccumulatedList} from "../hooks/useAccumulatedList.js";
import {useContext, useState} from "react";
import {ContactsListUI} from "../visual/ContactsListUI.jsx";
import {AddedContactsContext} from "../../context/addedContactsContext.js";

export function ContactsList() {
    const [pageInfo, setPageInfo] = useState({pageIndex: 0, pageSize: 50});
    const [filteredName, setFilteredName] = useState("");
    const {
        resultingList,
        status,
        resetErr
    } = useAccumulatedList('listContacts', {username: filteredName}, pageInfo, "username");
    const {addedContacts, setAddedContacts} = useContext(AddedContactsContext);

    function handleOnNameChange(newName) {
        setFilteredName(newName);
        setAddedContacts({}); // If we update filter, we don't need "fake" contacts anymore
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

    // FIXME the CPU is gonna be like: WTF DUDE! - need MEMO
    const finalContacts = [
        ...resultingList, ...((Object.keys(addedContacts).map((key) => addedContacts[key]?.contact) ?? [])
                .filter(contact => contact.username.toLowerCase().startsWith(filteredName.toLowerCase()))
        )
    ].reduce((acc, contact) => {
        if (!acc.some(existingContact => existingContact.username === contact.username)) {
            acc.push(contact);
        }
        return acc;
    }, []);

    return <ContactsListUI status={status} contacts={finalContacts} handleOnLoadMore={handleOnLoadMore}
                           setFilteredName={handleOnNameChange} deleteEnabled={true}/>
}