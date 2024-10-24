import {Outlet} from "react-router-dom";
import {UserContext} from "../context/userContext.jsx";
import {useState} from "react";
import LoginForm from "../components/functional/loginForm.jsx";
import SideMenu from "../components/visual/sideMenu.jsx";
import NavMenu from "../components/visual/navMenu.jsx";
import {useLocation} from 'react-router-dom';
import Register from "../components/visual/register.jsx";

export default function Root() {

    const [loggedUser, setLoggedUser] = useState({});
    let location = useLocation();

    function logout() {
        setLoggedUser({
            token: null, username: null,
        })
    }

    if (loggedUser?.token && location.pathname !== "/register") {
        return (<UserContext.Provider value={{userContext: loggedUser, logout}}>
            <NavMenu></NavMenu>
            <SideMenu></SideMenu>
            <Outlet/>
        </UserContext.Provider>);
    } else if (location.pathname === "/register") {
        return (<Register/>);
    } else {
        return (<LoginForm setLoggedUser={setLoggedUser}/>)
    }
}