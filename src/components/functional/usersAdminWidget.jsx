import {BannedUsersAdminList} from "./bannedUsersAdminList.jsx";
import {AdminPanelUserContext} from "../../context/adminPanelUserContext.js";
import {useState} from "react";
import {UsersAdminList} from "./usersAdminList.jsx";
import {Typography} from "@mui/material";
import {AdminManagement} from "./AdminManagement.jsx";


export function AdminWidget() {
    const [users, setUsers] = useState([]);
    const [usersFilter, setUsersFilter] = useState("");
    const [bannedUsers, setBannedUsers] = useState([]);
    const [bannedUsersFilter, setBannedUsersFilter] = useState("");

    return <AdminPanelUserContext.Provider value={
        {
            users,
            setUsers,
            usersFilter,
            setUsersFilter,
            bannedUsers,
            setBannedUsers,
            bannedUsersFilter,
            setBannedUsersFilter,
        }
    }>
        <div>
            <Typography variant="h5">Banning of users</Typography>
            <div className={"flex flex-col lg:flex-row"}>
                <div className={"w-full p-3 lg:w-1/2"}>
                    <UsersAdminList/>
                </div>
                <div className={"w-full p-3 lg:w-1/2"}>
                    <BannedUsersAdminList/>
                </div>
            </div>
            <Typography variant="h5">Administrators</Typography>
            <AdminManagement/>
        </div>
    </AdminPanelUserContext.Provider>
}