import {Typography} from "@mui/material";
import {AccountManagementForm} from "../components/functional/accountManagementForm.jsx";

export function AccountManagementRoute() {
    return <div className={"text-center space-y-3 p-3"}>
        <Typography variant="h4" gutterBottom className={"w-full"} textAlign={"center"}>
            Manage your account
        </Typography>
        <AccountManagementForm/>
    </div>
};