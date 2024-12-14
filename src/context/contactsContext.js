import React from "react";

// Should put there form values in format of {key, value}
export const ContactsContext = React.createContext({
    contacts: [], setContacts: (prevState) => {
    },
    contactFilter: "", setContactFilter: (prevState) => {},
});