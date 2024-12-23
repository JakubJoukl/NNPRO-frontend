import {useContext, useMemo, useRef, useState} from "react";
import {useFetchCall} from "../../hooks/useFetchCall.js";
import {AdminPanelUserContext} from "../../context/adminPanelUserContext.js";
import {UsersAdminListUI} from "../visual/usersListAdminUI.jsx";
import GavelIcon from '@mui/icons-material/Gavel';

export function BannedUsersAdminList() {
    const {bannedUsers, setBannedUsers, bannedUsersFilter, setBannedUsersFilter, usersFilter, users, setUsers} = useContext(AdminPanelUserContext);
    const [pageInfo, setPageInfo] = useState({pageIndex: 0, pageSize: 50});
    const inputDtoIn = useMemo(() => {
        return {username: bannedUsersFilter}
    }, [bannedUsersFilter]);
    const pageInfoMemo = useMemo(() => {
        return pageInfo
    }, [pageInfo]);
    const {dtoOut, status, resetErr} = useFetchCall('listBannedUsers', inputDtoIn, pageInfoMemo, updateBannedUsers);
    const previousName = useRef(bannedUsersFilter);

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

    function updateBannedUsers(response) {
        setBannedUsers((prevState) => {
            if (previousName.current !== bannedUsersFilter) {
                previousName.current = bannedUsersFilter;
                prevState = []; //bad?
            }
            return [...(response?.itemList ?? []), ...prevState].reduce((acc, user) => {
                if (!acc.some(existingBannedUser => existingBannedUser.username === user.username)) {
                    acc.push(user);
                }
                return acc;
            }, []);
        });
    }

    function handleUnbanCallback(unbannedUser) {
        setBannedUsers((prevState) => prevState.filter(user => user.username !== unbannedUser.username));
        if (unbannedUser.username.startsWith(usersFilter) && !users.find(user => user.username === unbannedUser.username)) {
            setUsers((prevState) => [
                ...prevState,
                unbannedUser
            ]);
        }
    }

    return <UsersAdminListUI header={"Banned users"} status={status} users={bannedUsers}
                             setFilteredName={setBannedUsersFilter} handleOnLoadMore={handleOnLoadMore}
                             onCallback={handleUnbanCallback}
                             action={{
                                 method: "unbanUser",
                                 successMessage: "User has been unbanned",
                                 failedMessage: "Banning of user failed",
                                 ActionIcon: GavelIcon
                             }}
                             confirmationPrompt={"Are you sure you want to unban user "}
                             confirmationDialogTitle={"Unban user"}
    />
}