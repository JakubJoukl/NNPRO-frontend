import React from "react";

// Should put there form values in format of {key, value}
export const AddedContactsContext = React.createContext({
    addedContacts: {}, setAddedContacts: (prevState) => {
    }
});