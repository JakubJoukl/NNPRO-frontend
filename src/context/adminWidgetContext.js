import React from "react";

// Should put there form values in format of {key, value}
export const AdminWidgetContext = React.createContext({
    admins: [], setAdmins: (prevState) => {
    },
    adminFilter: "", setAdminFilter: (prevState) => {},
});