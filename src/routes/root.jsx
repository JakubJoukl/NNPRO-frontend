import {Outlet} from "react-router-dom";
import {UserContext} from "../context/userContext.js";
import {useState} from "react";
import MainMenuBar from "../components/visual/mainMenuBar.jsx";
import LoginRoute from "./loginRoute.jsx";
import {Paper} from "@mui/material";
import {AddedConversationContext} from "../context/AddedConversationContext.js";
import {BASE_URI} from "../constants/calls.js";
import {StompSessionProvider} from "react-stomp-hooks";

export default function Root({routeName}) {
    const [loggedUser, setLoggedUser] = useState();
    const [addedConversations, setAddedConversation] = useState([]);

    if (loggedUser?.token) {
        return (<UserContext.Provider value={{userContext: loggedUser, setUserContext: setLoggedUser}}>
            <StompSessionProvider
                url={`${BASE_URI}/chat`}
                connectHeaders={{
                    Authorization: `Bearer ${loggedUser.token}`,
                }}
                //All options supported by @stomp/stompjs can be used here
            >
                <AddedConversationContext.Provider value={{addedConversations, setAddedConversation}}>
                    <MainMenuBar routeHeader={routeName}>
                        <Paper variant={"outlined"}
                               className={"w-full flex-grow h-screen overflow-auto flex justify-center"}>
                            <Outlet/>
                        </Paper>
                    </MainMenuBar>
                </AddedConversationContext.Provider>
            </StompSessionProvider>
        </UserContext.Provider>);
    } else {
        // Not in router so unlogged user is always redirected here
        return (
            <LoginRoute setLoggedUser={setLoggedUser} loggedUser={loggedUser}/>
        )
    }
}