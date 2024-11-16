import {Outlet} from "react-router-dom";
import {UserContext} from "../context/userContext.js";
import {useState} from "react";
import MainMenuBar from "../components/visual/mainMenuBar.jsx";
import LoginRoute from "./loginRoute.jsx";
import {Paper} from "@mui/material";
import {AddedConversationContext} from "../context/AddedConversationContext.js";

export default function Root({routeName}) {
    const [loggedUser, setLoggedUser] = useState();
    const [addedConversations, setAddedConversation] = useState({});

    if (loggedUser?.token && loggedUser.privateKey) {
        return (<UserContext.Provider value={{userContext: loggedUser, setUserContext: setLoggedUser}}>
            <AddedConversationContext.Provider value={{addedConversations, setAddedConversation}}>
                <MainMenuBar routeHeader={routeName}>
                    <Paper variant={"outlined"} className={"w-full flex-grow p-3"}>
                        <Outlet/>
                    </Paper>
                </MainMenuBar>
            </AddedConversationContext.Provider>
        </UserContext.Provider>);
    } else {
        // Not in router so unlogged user is always redirected here
        return (
            <LoginRoute setLoggedUser={setLoggedUser} loggedUser={loggedUser}/>
        )
    }
}