import {Outlet} from "react-router-dom";
import {UserContext} from "../context/userContext.jsx";
import {useState} from "react";
import MainMenuBar from "../components/visual/mainMenuBar.jsx";
import LoginRoute from "./loginRoute.jsx";

export default function Root({routeName}) {
    const [loggedUser, setLoggedUser] = useState({});

    function logout() {
        setLoggedUser({
            token: null, username: null,
        })
    }

    if (loggedUser?.token) {
        return (<UserContext.Provider value={{userContext: loggedUser, setUserContext: logout}}>
            <MainMenuBar routeHeader={routeName}>
                <Outlet/>
            </MainMenuBar>
        </UserContext.Provider>);
    } else {
        // Not in router so unlogged user is always redirected here
        return (
            <LoginRoute setLoggedUser={setLoggedUser}/>
        )
    }
}