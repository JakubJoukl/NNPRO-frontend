import React from "react";

// Should put there form values in format of {key, value}
export const AddedConversationContext = React.createContext({
    addedConversations: {}, setAddedConversation: (prevState) => {
    }
});