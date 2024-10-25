import {Outlet} from "react-router-dom";
import {UserContext} from "../context/userContext.jsx";
import {useState} from "react";
import LoginForm from "../components/functional/loginForm.jsx";
import SideMenu from "../components/visual/sideMenu.jsx";
import NavMenu from "../components/visual/navMenu.jsx";

export default function Root() {
    const [loggedUser, setLoggedUser] = useState({});

    function logout() {
        setLoggedUser({
            token: null, username: null,
        })
    }

    if (loggedUser?.token) {
        return (<UserContext.Provider value={{userContext: loggedUser, logout}}>
            <NavMenu></NavMenu>
            <SideMenu></SideMenu>
            <Outlet/>
        </UserContext.Provider>);
    } else {
        return (<LoginForm setLoggedUser={setLoggedUser}/>)
    }
}