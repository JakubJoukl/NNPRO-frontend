import {useContext, useMemo, useRef, useState} from "react";
import {ContactsListUI} from "../visual/ContactsListUI.jsx";
import {useFetchCall} from "../../hooks/useFetchCall.js";
import {ContactsContext} from "../../context/contactsContext.js";

export function ContactsList({onUserClicked, deleteEnabled}) {
    const {contacts, setContacts, contactFilter, setContactFilter} = useContext(ContactsContext);
    const [pageInfo, setPageInfo] = useState({pageIndex: 0, pageSize: 50});
    const inputDtoIn = useMemo(() => {
        return {username: contactFilter}
    }, [contactFilter]);
    const pageInfoMemo = useMemo(() => {
        return pageInfo
    }, [pageInfo]);
    const {dtoOut, status, resetErr} = useFetchCall('listContacts', inputDtoIn, pageInfoMemo, updateContacts);
    const previousName = useRef(contactFilter);

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

    function handleOnNameChange(newName) {
        setContactFilter(newName);
    }

    function updateContacts(response) {
        setContacts((prevState) => {
            if (previousName.current !== contactFilter) {
                previousName.current = contactFilter;
                prevState = []; //bad?
            }
            return [...(response?.itemList ?? []), ...prevState].reduce((acc, user) => {
                if (!acc.some(existingUser => existingUser.username === user.username)) {
                    acc.push(user);
                }
                return acc;
            }, []);
        });
    }

    return <ContactsListUI status={status} contacts={contacts} handleOnLoadMore={handleOnLoadMore}
                           setFilteredName={handleOnNameChange} deleteEnabled={deleteEnabled}
                           handleOnClick={onUserClicked}/>
}