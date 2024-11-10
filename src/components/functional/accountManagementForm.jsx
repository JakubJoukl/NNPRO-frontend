import {AccountManagementFormUI} from "../visual/accountManagementFormUI.jsx";
import {useSubmitCall} from "../hooks/useSubmitCall.js";
import {useFetchCall} from "../hooks/useFetchCall.js";
import {FormContext} from "../../context/formContext.js"
import {useEffect, useRef} from "react";

export function AccountManagementForm() {
    const {dtoOut, status, resetErr} = useFetchCall("getCurrentUserProfile", null, null);
    const {status: submitFormStatus, call} = useSubmitCall(
        "updateUser", "Account updated successfully.",
        "Updating of account failed due to unknown error."
    );
    const profileLoadSuccess = useRef(false);
    const formRef = useRef({
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
    useEffect(() => {
        // Populate formRef when dtoOut is updated successfully
        if (!status.callInProgress && !status.isError && !profileLoadSuccess.current) {
            profileLoadSuccess.current = true;
            formRef.current = {
                username: {
                    value: dtoOut.username || "",
                    edited: false,
                },
                email: {
                    value: dtoOut.email || "",
                    edited: false,
                },
                publicKey: {
                    value: dtoOut.publicKey || "",
                    edited: false,
                },
            };
        }
    }, [dtoOut, status]); // Watch dtoOut and status for changes

    return <FormContext.Provider value={{
        formRef, onSubmit: call
    }}>
        <AccountManagementFormUI status={status} resetError={resetErr} callInProgress={submitFormStatus.callInProgress}/>
    </FormContext.Provider>
}