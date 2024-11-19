import {DraggableDialog} from "../visual/DraggableDialog.jsx";
import {FormContext} from "../../context/formContext.js";
import {PrivateKeyInputUI} from "../visual/privateKeyInputUi.jsx";
import {PrivatePublicKeyField} from "../visual/PrivatePublicKeyField.jsx";
import {Alert, Button, CircularProgress, TextField, Typography} from "@mui/material";
import * as React from "react";
import {useContext, useRef, useState} from "react";
import {useFetchCall} from "../../hooks/useFetchCall.js";
import {useSubmitCall} from "../../hooks/useSubmitCall.js";
import {UserContext} from "../../context/userContext.js";
import ListItem from "@mui/material/ListItem";

export default function FormManagementDialog() {
    //TODO separate visual and functional part
    const {dtoOut, status, resetErr} = useFetchCall("getCurrentUserProfile", null, null, updateForm);
    const {status: submitFormStatus, call, dtoOut: submitCallDtoOut} = useSubmitCall(
        "updateUser", "Account updated successfully.",
        "Updating of account failed due to unknown error.",
        updateUserContext
    );
    const [publicKey, setPublicKey] = useState({});
    const {userContext, setUserContext} = useContext(UserContext);

    function handleOnCall(submitDtoIn) {
        call(submitDtoIn, undefined);
    }

    const formRef = useRef({
        publicKey: {
            value: dtoOut.publicKey || "",
            edited: false,
        },
    });

    function updateUserContext(dtoOut){
        if (typeof dtoOut === "object") {
            delete dtoOut.email;
            setUserContext({
                    ...userContext,
                    ...dtoOut
                }
            );
        }
    }

    function updateForm(dtoOut) {
        formRef.current = {
            publicKey: {
                value: dtoOut.publicKey || "",
                edited: false,
            },
        };
        setPublicKey(dtoOut.publicKey); // just for re-render
    }

    function renderPublicKeySection(){
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
            return (<div className={"flex flex-col justify-center items-center space-y-6"}>
                <PrivatePublicKeyField id={"publicKey"} className={"w-full max-w-2xl"} centerButtons={true}/>
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
                    className={"w-fit"}
                    disabled={submitFormStatus.callInProgress}
                    onClick={async () => {
                        const submitDtoIn = {
                            confirmationPassword: formRef.current.confirmationPassword ?? null,
                        };
                        for (const key in formRef.current) {
                            if (formRef.current[key].edited) {
                                submitDtoIn[key] = formRef.current[key].value;
                            }
                        }
                        call(submitDtoIn);
                    }
                    }
                    color={"primary"}
                >Confirm changes</Button>
            </div>)
        }
    }

    console.log("re-render");
    return (<FormContext.Provider value={{
        formRef, onSubmit: handleOnCall
    }}><div className={"space-y-6"}>
        <PrivateKeyInputUI/>
        <Typography variant="h5">
            Generate keypair:
        </Typography>
        {renderPublicKeySection()}
    </div>
    </FormContext.Provider>);
}