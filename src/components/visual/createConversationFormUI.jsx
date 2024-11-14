import {Button, IconButton, TextField, Typography} from "@mui/material";
import {ArrowBack} from "@mui/icons-material";
import {useContext, useRef, useState} from "react";
import {UserContext} from "../../context/userContext.js";

export function CreateConversationFormUI({selectedContact, setSelectedContact, status, onSubmit}) {
    const [conversationName, setConversationName] = useState("");
    const typingTimeoutRef = useRef({});
    const userContext = useContext(UserContext).userContext;

    // True means valid, false means invalid
    const [validations, setValidations] = useState({conversationName: true});

    function validateWithTimeout(changedKey, value) {
        if (typingTimeoutRef.current[changedKey]) clearTimeout(typingTimeoutRef.current[changedKey]);
        // Set a new timeout for delayed validation
        const timeoutId = setTimeout(() => {
            validate(changedKey, value);
        }, 500);
        // Update the timeout ID for this specific input
        typingTimeoutRef.current[changedKey] = timeoutId
    }

    function validate(changedKey, targetValue) {
        let conversationNameIsValid;

        //https://www.auditboard.com/blog/nist-password-guidelines/
        const userNameRegex = "^.{7,29}$";
        switch (changedKey) {
            case "conversationName":
                conversationNameIsValid = targetValue?.match(userNameRegex);
                break;
            default:
                //all - so we have no target value... should not be used in onChange as the state change is not guaranteed to be on time of validation...
                conversationNameIsValid = conversationName?.match(userNameRegex);
                break;
        }

        setValidations({
            conversationName: conversationNameIsValid
        });
        return {
            conversationName: conversationNameIsValid,
        };
    }

    return (<div className={"w-full 2xl:w-[50rem] lg:w-[43rem] space-y-3 flex flex-col items-center"}>
        <div className={"flex flex-row items-center justify-start w-full"}>
            <IconButton onClick={() => setSelectedContact(null)} className={"!absolute"} color={"primary"}><ArrowBack/></IconButton>
            <Typography variant="h6" className={"text-center !flex-grow"}>
                Begin new conversation with <Typography color={"primary"} variant={"span"}>{
                <b>{selectedContact.username}</b>}</Typography>.
            </Typography>
        </div>
        <TextField onChange={(e) => {
            setConversationName(() => e.target.value)
            validateWithTimeout("conversationName", e.target.value);
        }}
                   id="conversationName"
                   label="Conversation name" variant="filled" className={"w-full"}
                   error={!(validations.conversationName)}
                   helperText={!(validations.conversationName) && "Conversation name must be between 7 and 29 characters long."}
        />
        <Button disabled={status.callInProgress || selectedContact.publicKey == null} size="large" variant="outlined"
                onClick={() => {
                    onSubmit(conversationName);
                }}
                color={"primary"}
                className={"w-fit"}
        >Create conversation</Button>
        {selectedContact.publicKey == null &&
            <Typography color={"red"} variant={"span"}>{<b>User <Typography color={"primary"} variant={"span"}>{
                <b>Can&#39;t start encrypted conversation - {selectedContact.username}</b>}</Typography> has
                not set public key yet!</b>}</Typography>}
        {(userContext.publicKey == null || userContext.privateKey == null) &&
            <Typography color={"red"} variant={"span"}>{<b>Can&#39;t start encrypted conversation - You have not set your public key or private key. You have to
                set your keypair first!</b>}</Typography>}
    </div>)
}