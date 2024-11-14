import {AccountManagementFormUI} from "../visual/accountManagementFormUI.jsx";
import {useSubmitCall} from "../../hooks/useSubmitCall.js";
import {useFetchCall} from "../../hooks/useFetchCall.js";
import {FormContext} from "../../context/formContext.js"
import {useContext, useRef} from "react";
import {UserContext} from "../../context/userContext.js";

export function AccountManagementForm() {
    const {dtoOut, status, resetErr} = useFetchCall("getCurrentUserProfile", null, null);
    const {status: submitFormStatus, call, dtoOut: submitCallDtoOut} = useSubmitCall(
        "updateUser", "Account updated successfully.",
        "Updating of account failed due to unknown error."
    );
    const shouldUpdateContextRef = useRef(false);

    function handleOnCall(submitDtoIn) {
        shouldUpdateContextRef.current = true;
        call(submitDtoIn, undefined);
    }

    const {userContext, setUserContext} = useContext(UserContext);
    if (shouldUpdateContextRef.current && submitFormStatus && submitFormStatus.callFinished) {
        if (typeof submitCallDtoOut === "object") {
            delete dtoOut.email;
            console.log(userContext, "userContext");
            console.log(submitCallDtoOut, "dtoOut");
            console.log({
                ...userContext,
                ...submitCallDtoOut
            });
            setUserContext({
                    ...userContext,
                    ...submitCallDtoOut
                }
            );
        }
        shouldUpdateContextRef.current = false;
    }
    // This has to be ref so this form is not reloaded on change
    const isInitialLoadRef = useRef(true);
    const formRef = useRef({});
    if (isInitialLoadRef.current) {
        if (status.callFinished) {
            isInitialLoadRef.current = false;
        }
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

    return <FormContext.Provider value={{
        formRef, onSubmit: handleOnCall
    }}>
        <AccountManagementFormUI status={status} resetError={resetErr}
                                 callInProgress={submitFormStatus.callInProgress}/>
    </FormContext.Provider>
}