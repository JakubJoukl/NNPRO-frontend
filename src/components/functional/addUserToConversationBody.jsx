import {useAccumulatedList} from "../../hooks/useAccumulatedList.js";
import {useContext, useMemo, useState} from "react";
import {AddUserToConversationBodyUI} from "../visual/AddUserConversationBodyUI.jsx";
import {useSubmitCall} from "../../hooks/useSubmitCall.js";
import {encryptAesKey} from "../helpers/cryptographyHelper.js";
import {UserContext} from "../../context/userContext.js";

export function AddUserToConversationBody({decryptedKey, conversation, onSubmit}) {
    const [pageInfo, setPageInfo] = useState({pageIndex: 0, pageSize: 50});
    const [filterName, setFilterName] = useState("");
    const {privateKey, publicKey} = useContext(UserContext).userContext;

    const {
        resultingList,
        status: listStatus,
        resetErr
    } = useAccumulatedList('listContacts', {username: filterName}, pageInfo, "username");


    const {status, call} = useSubmitCall(
        "addUserToConversation", "User has been added to conversation",
        "Adding user to conversation failed",
        finishAddUserToConversation
    );

    async function addUserToConversation(selectedContact) {
        const {key, iv} = await encryptAesKey(privateKey, selectedContact.publicKey, decryptedKey);
        call({
            conversationId: conversation.conversationId,
            user: selectedContact.username,
            encryptedSymmetricKey: key,
            iv,
            cipheringPublicKey: publicKey
        });
    }

    function finishAddUserToConversation() {
        onSubmit();
    }

    function handleOnLoadMore() {
        if (listStatus.isError && !listStatus.callInProgress) {
            resetErr();
            setPageInfo({pageIndex: 0, pageSize: 50});
        } else if (!listStatus.callInProgress) {
            setPageInfo((previousPageInfo) => {
                return {
                    ...previousPageInfo,
                    pageIndex: previousPageInfo.pageIndex + 1,
                }
            });
        }
    }

    const finalContactList = useMemo(() => {
        return resultingList.filter((user) => !conversation.users.some((conversationUser) => conversationUser.username === user.username));
    }, [resultingList, conversation])

    return (
        <AddUserToConversationBodyUI status={listStatus} onSubmit={addUserToConversation} setFilterName={setFilterName}
                                     contacts={finalContactList} handleOnLoadMore={handleOnLoadMore}
                                     submitStatus={status}/>);
}