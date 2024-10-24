import Stack from '@mui/material/Stack';
import classes from '../../styles/loginForm.module.css'
import {Button, Card, CardContent, TextField, Typography} from "@mui/material";
import {useState} from "react";
import {NavLink} from "react-router-dom";

export default function LoginFormUI({onSubmit, disableLoginButton}) {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    return (
        <Stack className={`${classes.mainStack} p-4`}>
            <Card variant="outlined" className={`${classes.card} w-[36rem] max-w-full m-3`}>
                <>
                    <CardContent className={"!space-y-3"}>
                        <Typography variant="h5" gutterBottom>
                            Login to secure chat 🔒
                        </Typography>
                        <TextField onChange={(e) => setUsername(() => e.target.value)}
                                   id="filled-basic"
                                   label="Username" variant="filled" className={"w-full"}/>
                        <TextField onChange={(e) => setPassword(() => e.target.value)}
                                   id="filled-basic"
                                   label="Password" variant="filled" type="password"
                                   autoComplete="current-password" className={"w-full"}/>
                    </CardContent>
                    <CardContent className={"flex flex-row-reverse"}>
                        <Button disabled={disableLoginButton} size="large" variant="outlined"
                                onClick={() => onSubmit(username, password)
                        }
                        className={".button"}
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