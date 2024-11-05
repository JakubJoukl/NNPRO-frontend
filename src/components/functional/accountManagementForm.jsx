import {AccountManagementFormUI} from "../visual/accountManagementFormUI.jsx";
import {useCall} from "../hooks/useCall.js";
import {FormContext} from "../../context/formContext.js"
import {useState} from "react";

export function AccountManagementForm() {
    const {dtoOut, status, resetErr} = useCall("getCurrentUserProfile", null, null)
    const [formContext, setFormContext] = useState({
        username: {
            value: dtoOut.username,
            edited: false,
        },
        email: {
            value: dtoOut.email,
            edited: false,
        },
        publicKey: {
            value: dtoOut.publicKey,
            edited: false,
        }
    });

    if (dtoOut.username !== formContext.username?.value || dtoOut.email !== formContext.email?.value) {
        setFormContext({
            username: {
                value: dtoOut.username,
                edited: false,
            },
            email: {
                value: dtoOut.email,
                edited: false,
            },
            publicKey: {
                value: dtoOut.publicKey,
                edited: false,
            }
        });
    }

    return <FormContext.Provider value={{formContext, setFormContext}}>
        <AccountManagementFormUI status={status} resetError={resetErr}/>
    </FormContext.Provider>
}