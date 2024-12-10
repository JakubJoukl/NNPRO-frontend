import React from "react";

// Should put there form values in format of {key, value}
export const ConversationContext = React.createContext({
    conversations: [], setConversations: (prevState) => {
    }
});