import {Alert, Button, CircularProgress, TextField} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import {EditableInputTextField} from "./EditableInputTextField.jsx";
import {PrivatePublicKeyField} from "./PrivatePublicKeyField.jsx";
import {useContext} from "react";
import {FormContext} from "../../context/formContext.js";

export function AccountManagementFormUI({status, resetError, callInProgress}) {
    const {formRef, onSubmit} = useContext(FormContext);
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
    } else {
        return <div className={"flex flex-col justify-center align-middle items-center space-y-3"}>
            <EditableInputTextField label={"Username"} id={"username"} className={"w-full max-w-2xl"}/>
            <EditableInputTextField label={"Email"} id={"email"} className={"w-full max-w-2xl"}/>

            <TextField onChange={(e) => setPassword(() => e.target.value)}
                       id="password"
                       label="Password" variant="filled" type="password"
                       className={"w-full max-w-2xl"}/>
            <PrivatePublicKeyField label={"Public key"} id={"publicKey"} className={"w-full max-w-2xl"}/>
            <TextField onChange={(e) => formRef.current = {
                ...formRef.current,
                confirmationPassword: e.target.value
            }}
                       id="confirmationPassword"
                       label="Confirmation password" variant="filled" type="password"
                       helperText={"Your current password."}
                       autoComplete="current-password" className={"w-full max-w-2xl"}/>
            <Button
                size="large" variant="outlined"
                disabled={callInProgress}
                onClick={async () => {
                    const submitDtoIn = {
                        confirmationPassword: formRef.current.confirmationPassword ?? null,
                    };
                    console.log(formRef.current, "from inner submit")
                    for (const key in formRef.current) {
                        if (formRef.current[key].edited) {
                            submitDtoIn[key] = formRef.current[key].value;
                        }
                    }
                    onSubmit(submitDtoIn, undefined);
                }
                }
                color={"primary"}
            >Confirm changes</Button>
        </div>
    }
}