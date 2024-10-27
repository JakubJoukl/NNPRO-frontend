import classes from "../styles/loginForm.module.css";
import Stack from "@mui/material/Stack";
import RegisterForm from "../components/functional/registerForm.jsx";

export default function RegisterRoute() {
    return (<Stack className={`${classes.mainStack} p-4`}>
        <RegisterForm/>
    </Stack>)
}