import {useContext, useMemo, useRef, useState} from "react";
import {useFetchCall} from "../../hooks/useFetchCall.js";
import {AdminPanelUserContext} from "../../context/adminPanelUserContext.js";
import {UsersAdminListUI} from "../visual/usersListAdminUI.jsx";
import NotInterestedIcon from '@mui/icons-material/NotInterested';

export function UsersAdminList() {
    const {
        users,
        setUsers,
        usersFilter,
        setUsersFilter,
        bannedUsersFilter,
        bannedUsers,
        setBannedUsers
    } = useContext(AdminPanelUserContext);
    const [pageInfo, setPageInfo] = useState({pageIndex: 0, pageSize: 50});
    const inputDtoIn = useMemo(() => {
        return {username: usersFilter}
    }, [usersFilter]);
    const pageInfoMemo = useMemo(() => {
        return pageInfo
    }, [pageInfo]);
    const {
        dtoOut,
        status,
        resetErr
    } = useFetchCall('listNotBannedUsers', inputDtoIn, pageInfoMemo, updateNotBannedUsers);
    const previousName = useRef(usersFilter);

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

    function updateNotBannedUsers(response) {
        setUsers((prevState) => {
            if (previousName.current !== usersFilter) {
                previousName.current = usersFilter;
                prevState = []; //bad?
            }
            return [...(response?.itemList ?? []), ...prevState].reduce((acc, user) => {
                if (!acc.some(existingNotBannedUser => existingNotBannedUser.username === user.username)) {
                    acc.push(user);
                }
                return acc;
            }, []);
        });
    }

    function handleBanCallback(bannedUser) {
        setUsers((prevState) => prevState.filter(user => user.username !== bannedUser.username));
        if (bannedUser.username.startsWith(bannedUsersFilter) && !bannedUsers.find(user => user.username === bannedUser.username)) {
            setBannedUsers((prevState) => [
                ...prevState,
                bannedUser
            ]);
        }
    }

    return <UsersAdminListUI header={"Active users"} status={status} users={users} setFilteredName={setUsersFilter}
                             handleOnLoadMore={handleOnLoadMore}
                             onCallback={handleBanCallback} action={{
        ActionIcon: NotInterestedIcon,
        method: "banUser",
        successMessage: "User has been banned",
        failedMessage: "Banning of user failed"
    }}
                             confirmationPrompt={"Are you sure you want to ban user "}
                             confirmationDialogTitle={"Ban user"}
    />
}