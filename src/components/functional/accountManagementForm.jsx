import {AccountManagementFormUI} from "../visual/accountManagementFormUI.jsx";
import {useSubmitCall} from "../../hooks/useSubmitCall.js";
import {useFetchCall} from "../../hooks/useFetchCall.js";
import {FormContext} from "../../context/formContext.js"
import {useContext, useRef} from "react";
import {UserContext} from "../../context/userContext.js";

export function AccountManagementForm() {
    const {dtoOut, status, resetErr} = useFetchCall("getCurrentUserProfile", null, null, updateForm);
    const {status: submitFormStatus, call, dtoOut: submitCallDtoOut} = useSubmitCall(
        "updateUser", "Account updated successfully.",
        "Updating of account failed due to unknown error.",
        updateUserContext
    );

    function handleOnCall(submitDtoIn) {
        call(submitDtoIn, undefined);
    }

    const {userContext, setUserContext} = useContext(UserContext);

    const formRef = useRef({});

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