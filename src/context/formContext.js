import React from "react";

// Should put there form values in format of {key, value}
export const FormContext = React.createContext({
    formRef: {}, onSubmit: () => {
    }
});