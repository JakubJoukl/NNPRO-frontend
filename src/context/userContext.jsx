import React from "react";


//
// {
//   "token": "someToken",
//   "username": "username"
// }
export const UserContext = React.createContext({
    userContext: {
        token: null,
        username: null,
    },
    // eslint-disable-next-line no-unused-vars
    setUserContext: (prevState) => {
    }
});