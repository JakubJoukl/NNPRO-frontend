import classes from "../styles/loginForm.module.css";
import Stack from "@mui/material/Stack";
import {ResetPasswordWidget} from "../components/visual/ResetPasswordWidget.jsx";

export function ResetPasswordRoute() {
    return (<Stack className={`${classes.mainStack} p-4`}>
        <ResetPasswordWidget/>
    </Stack>)
}