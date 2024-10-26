import React from "react";

export const GlobalAlertContext = React.createContext({
    openAlert: (message, severity) => {
    },
    closeAlert: () => {
    },
});