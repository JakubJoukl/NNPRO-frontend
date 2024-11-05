import {Alert, Button, CircularProgress, TextField} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import {EditableInputTextField} from "./EditableInputTextField.jsx";
import {useContext} from "react";
import {FormContext} from "../../context/formContext.js";

export function AccountManagementFormUI({status, resetError}) {
    if (status.isError) {
        return <><Alert
            severity={"error"}
            variant="filled"
            sx={{width: '100%'}}
        >
            Error occurred during loading of user profile.
        </Alert>
            <Button
                size="large" variant="outlined"
                onClick={() => {
                    resetError()
                }
                }
                color={"primary"}
            >Reload</Button>
        </>
    } else if (status.callInProgress) {
        return <ListItem disablePadding key={"progressCircle"} className={"flex !justify-center mt-3 flex-row"}>
            <CircularProgress className={'ml-3'} color="primary"/>
        </ListItem>
    }
    return <div className={"flex flex-col justify-center align-middle items-center space-y-3"}>
        <EditableInputTextField label={"Username"} id={"username"} className={"w-full max-w-2xl"}/>
        <EditableInputTextField label={"Email"} id={"email"} className={"w-full max-w-2xl"}/>

        <TextField onChange={(e) => setPassword(() => e.target.value)}
                   id="password"
                   label="Password" variant="filled" type="password"
                   autoComplete="current-password" className={"w-full max-w-2xl"}/>
    </div>
}