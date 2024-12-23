import {useContext, useMemo, useRef, useState} from "react";
import {useFetchCall} from "../../hooks/useFetchCall.js";
import {AdminWidgetContext} from "../../context/adminWidgetContext.js";
import {AdminListUI} from "../visual/AdminListUI.jsx";

export function AdminList() {
    const {admins, setAdmins, adminFilter, setAdminFilter} = useContext(AdminWidgetContext);
    const [pageInfo, setPageInfo] = useState({pageIndex: 0, pageSize: 50});
    const inputDtoIn = useMemo(() => {
        return {username: adminFilter, authorities: ["ADMIN"]}
    }, [adminFilter]);
    const pageInfoMemo = useMemo(() => {
        return pageInfo
    }, [pageInfo]);
    const {dtoOut, status, resetErr} = useFetchCall('searchUsers', inputDtoIn, pageInfoMemo, updateAdministrators);
    const previousName = useRef(adminFilter);

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
        setAdminFilter(newName);
    }

    function updateAdministrators(response) {
        setAdmins((prevState) => {
            if (previousName.current !== adminFilter) {
                previousName.current = adminFilter;
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

    return <AdminListUI status={status} admins={admins} handleOnLoadMore={handleOnLoadMore}
                           setFilteredName={handleOnNameChange}/>
}