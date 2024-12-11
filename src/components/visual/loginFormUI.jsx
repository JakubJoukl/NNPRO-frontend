import classes from '../../styles/loginForm.module.css'
import {Button, Card, CardContent, TextField, Typography} from "@mui/material";
import {useCallback, useEffect, useRef, useState} from "react";
import {NavLink} from "react-router-dom";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";

export default function LoginFormUI({onSubmit, disableLoginButton}) {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const {executeRecaptcha} = useGoogleReCaptcha();
    const tokenRef = useRef('');

    // Create an event handler so you can call the verification on button click event or form submit
    const handleReCaptchaVerify = useCallback(async () => {
        if (!executeRecaptcha) {
            console.log('Execute recaptcha not yet available');
            return;
        }

        tokenRef.current = await executeRecaptcha('login');
        // Do whatever you want with the token
    }, [executeRecaptcha]);

    // You can use useEffect to trigger the verification as soon as the component being loaded
    useEffect(() => {
        handleReCaptchaVerify();
    }, [handleReCaptchaVerify]);

    return (
        <>
            <Card variant="outlined" className={`${classes.card} w-[36rem] max-w-full m-3`}>
                <>
                    <CardContent className={"!space-y-3"}>
                        <Typography variant="h5" gutterBottom>
                            Login to secure chat 🔒
                        </Typography>
                        <TextField onChange={(e) => setUsername(() => e.target.value)}
                                   id="username"
                                   label="Username" variant="filled" className={"w-full"}/>
                        <TextField onChange={(e) => setPassword(() => e.target.value)}
                                   id="password"
                                   label="Password" variant="filled" type="password"
                                   autoComplete="current-password" className={"w-full"}/>
                    </CardContent>
                    <CardContent className={"flex flex-col"}>
                        <Button className={"w-fit !mr-auto !ml-auto"} disabled={disableLoginButton} size="large" variant="outlined"
                                onClick={() => {
                                    handleReCaptchaVerify().then(() => {
                                        onSubmit(username, password, tokenRef.current);
                                    });
                                }}
                                color={"primary"}
                        >Login</Button>
                        <Typography variant="p">
                            Forgotten password? <NavLink className={"inline-link"} to={"/resetPassword"}>Reset</NavLink>
                        </Typography>
                    </CardContent>
                </>
            </Card>
            <Card variant="outlined" className={`${classes.card} w-[36rem] max-w-full m-3`}>
                <CardContent className={"!p-4 flex justify-center"}>
                    <Typography variant="p">
                        Not a member yet? <NavLink className={"inline-link"} to={"/register"}>Register</NavLink>
                    </Typography>
                </CardContent>
            </Card>
        </>
    )
}