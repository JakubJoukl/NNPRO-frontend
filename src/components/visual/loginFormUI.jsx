import Stack from '@mui/material/Stack';
import classes from '../../styles/loginForm.module.css'
import {Button, Card, CardContent, TextField, Typography} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";

export default function LoginFormUI({onSubmit, disableLoginButton}) {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const {executeRecaptcha} = useGoogleReCaptcha();
    const [token, setToken] = useState('');


    // Create an event handler so you can call the verification on button click event or form submit
    const handleReCaptchaVerify = useCallback(async () => {
        if (!executeRecaptcha) {
            console.log('Execute recaptcha not yet available');
            return;
        }

        const token = await executeRecaptcha('register');
        setToken(token);
        // Do whatever you want with the token
    }, [executeRecaptcha]);

    // You can use useEffect to trigger the verification as soon as the component being loaded
    useEffect(() => {
        handleReCaptchaVerify();
    }, [handleReCaptchaVerify]);

    return (
        <Stack className={`${classes.mainStack} p-4`}>
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
                    <CardContent className={"flex flex-row-reverse"}>
                        <Button disabled={disableLoginButton} size="large" variant="outlined"
                                onClick={() => {
                                    handleReCaptchaVerify().then(() => {
                                        onSubmit(username, password, token);
                                    });
                                }}
                                color={"primary"}
                        >Login</Button>
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
        </Stack>
    )
}