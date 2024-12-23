import React from "react";

// Should put there form values in format of {key, value}
export const AdminPanelUserContext = React.createContext({
    users: [],
    usersFilter: "",
    setUsersFilter: (prevState) => {
    },
    setUsers: (prevState) => {
    },
    bannedUsers: [],
    bannedUsersFilter: "",
    setBannedUsersFilter: (prevState) => {
    },
    setBannedUsers: (prevState) => {
    }
});