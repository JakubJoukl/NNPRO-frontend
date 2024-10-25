import Stack from '@mui/material/Stack';
import classes from '../../styles/loginForm.module.css'
import {Button, Card, CardContent, TextField, Typography} from "@mui/material";
import {useState} from "react";
import {NavLink} from "react-router-dom";

export default function RegisterFormUI({onSubmit, disableLoginButton}) {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [password2, setPassword2] = useState();
    const [email, setEmail] = useState();

    return (
        //TODO VALIDATIONS!!!!
        <Stack className={`${classes.mainStack} p-4`}>
            <Card variant="outlined" className={`${classes.card} w-[36rem] max-w-full m-3`}>
                <>
                    <CardContent className={"!space-y-3"}>
                        <Typography variant="h5" gutterBottom>
                            Registration of a new user to secure chat 🔒
                        </Typography>
                        <TextField onChange={(e) => setUsername(() => e.target.value)}
                                   id="Username"
                                   label="Username" variant="filled" className={"w-full"}/>
                        <TextField onChange={(e) => setEmail(() => e.target.value)}
                                   id="Mail"
                                   label="Mail" variant="filled" className={"w-full"} type="email"/>
                        <TextField onChange={(e) => setPassword(() => e.target.value)}
                                   id="password"
                                   label="Password" variant="filled" type="password"
                                   autoComplete="current-password" className={"w-full"}/>
                        <TextField onChange={(e) => setPassword2(() => e.target.value)}
                                   id="password2"
                                   label="Enter password again" variant="filled" type="password"
                                   autoComplete="current-password" className={"w-full"}/>
                    </CardContent>
                    <CardContent className={"flex flex-row-reverse"}>
                        <Button disabled={disableLoginButton} size="large" variant="outlined"
                                onClick={() => onSubmit(username, password, email)}
                                color={"primary"}
                        >Register</Button>
                    </CardContent>
                </>
            </Card>
            <Card variant="outlined" className={`${classes.card} w-[36rem] max-w-full m-3`}>
                <CardContent className={"!p-4 flex justify-center"}>
                    <Typography variant="p">
                        Already a member? <NavLink className={"inline-link"} to={"/"}>Login</NavLink>
                    </Typography>
                </CardContent>
            </Card>
        </Stack>
    )
}