import {AccountManagementFormUI} from "../visual/accountManagementFormUI.jsx";
import {useCall} from "../hooks/useCall.js";
import {FormContext} from "../../context/formContext.js"
import {useState} from "react";

export function AccountManagementForm() {
    const {dtoOut, status, resetErr} = useCall("getCurrentUserProfile", null, null)
    const [formContext, setFormContext] = useState({
        username: dtoOut.username,
        email: dtoOut.email,
        publicKey: dtoOut.publicKey
    });

    if (dtoOut.username !== formContext.username || dtoOut.email !== formContext.email) {
        setFormContext({
            username: dtoOut.username,
            email: dtoOut.email,
            publicKey: dtoOut.publicKey
        });
    }

    return <FormContext.Provider value={{formContext, setFormContext}}>
        <AccountManagementFormUI status={status} resetError={resetErr}/>
    </FormContext.Provider>
}