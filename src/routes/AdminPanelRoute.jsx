import {Alert, Typography} from "@mui/material";
import {useContext, useState} from "react";
import {UserContext} from "../context/userContext.js";
import AuthorizationHelper from "../components/helpers/authorizationHelper.js";
import {AdminWidget} from "../components/functional/usersAdminWidget.jsx";

export function AdminPanelRoute() {
    const userContext = useContext(UserContext);
    return <div className={"text-center p-3 w-full 2xl:w-[50rem] lg:w-[43rem]"}>
        <Typography variant="h4" gutterBottom className={"w-full"} textAlign={"center"}>
            Administrator panel
        </Typography>
        {AuthorizationHelper.userIsAuthorities(userContext.userContext.userRoles) &&
            <AdminWidget/>
        }
        {!AuthorizationHelper.userIsAuthorities(userContext.userContext.userRoles) && <Alert
            severity={"error"}
            variant="filled"
            sx={{width: '100%'}}
        >
            User is not authorized to see admin panel.
        </Alert>}
    </div>
};