import {Outlet} from "react-router-dom";
import {UserContext} from "../context/userContext.js";
import {useState} from "react";
import MainMenuBar from "../components/visual/mainMenuBar.jsx";
import LoginRoute from "./loginRoute.jsx";
import {Paper} from "@mui/material";

export default function Root({routeName}) {
    const [loggedUser, setLoggedUser] = useState();

    if (loggedUser?.token && loggedUser.privateKey) {
        return (<UserContext.Provider value={{userContext: loggedUser, setUserContext: setLoggedUser}}>
            <MainMenuBar routeHeader={routeName}>
                <Paper variant={"outlined"} className={"w-full flex-grow p-3"}>
                    <Outlet/>
                </Paper>
            </MainMenuBar>
        </UserContext.Provider>);
    } else {
        // Not in router so unlogged user is always redirected here
        return (
            <LoginRoute setLoggedUser={setLoggedUser} loggedUser={loggedUser}/>
        )
    }
}