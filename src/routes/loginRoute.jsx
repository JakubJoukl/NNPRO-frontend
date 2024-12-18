import classes from "../styles/loginForm.module.css";
import Stack from "@mui/material/Stack";
import LoginForm from "../components/functional/loginForm.jsx";

export default function LoginRoute({loggedUser,setLoggedUser}) {
    return (<Stack className={`${classes.mainStack} p-4`}>
        {!loggedUser?.token && <LoginForm setLoggedUser={setLoggedUser}/>}
    </Stack>)
}