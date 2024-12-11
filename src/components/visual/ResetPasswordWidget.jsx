import {Button, Card, CardContent, TextField, Typography} from "@mui/material";
import classes from "../../styles/loginForm.module.css";
import {NavLink} from "react-router-dom";
import {useState} from "react";
import {EnterCode} from "./enterCodeDialog.jsx";
import {EnterMail} from "./enterMailDialog.jsx";

export function ResetPasswordWidget() {
    const [currentAction, setCurrentAction] = useState("initialChoice");

    function renderChoiceDialog() {
        return (<div className={"!space-y-3 flex flex-col"}>
            <Typography variant="p" gutterBottom>
                Do you have code?
            </Typography>
            <Button className={"w-fit !mr-auto !ml-auto"} size="large" variant="outlined"
                    onClick={() => {
                        setCurrentAction("resetCode")
                    }}
                    color={"primary"}
            >Enter reset code</Button>
            <Typography variant="p" gutterBottom>
                If not, let&#39;s generate one!
            </Typography>
            <Button className={"w-fit !mr-auto !ml-auto"} size="large" variant="outlined"
                    onClick={() => {
                        setCurrentAction("mail")
                    }}
                    color={"primary"}
            >Send reset code to mail</Button>
        </div>)
    }

    return (
        <>
            <Card variant="outlined" className={`${classes.card} w-[36rem] max-w-full m-3`}>
                <>
                    <CardContent className={"!space-y-3"}>
                        <Typography variant="h5" gutterBottom>
                            Reset your password
                        </Typography>
                        {currentAction === "initialChoice" && renderChoiceDialog()}
                        {currentAction === "mail" && <EnterMail onBack={() => setCurrentAction("initialChoice")} />}
                        {currentAction === "resetCode" && <EnterCode onBack={() => setCurrentAction("initialChoice")} />}
                    </CardContent>
                </>
            </Card>
            <Card variant="outlined" className={`${classes.card} w-[36rem] max-w-full m-3`}>
                <CardContent className={"!p-4 flex justify-center"}>
                    <Typography variant="p">
                        Remembered your password? <NavLink className={"inline-link"} to={"/"}>Back to login</NavLink>
                    </Typography>
                </CardContent>
            </Card>
        </>
    );
}