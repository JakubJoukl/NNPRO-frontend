import classes from '../../styles/loginForm.module.css'
import {Button, Card, CardContent, TextField, Typography} from "@mui/material";
import {useCallback, useContext, useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import {GlobalAlertContext} from "../../context/globalAlertContext.js";
import {
    useGoogleReCaptcha
} from 'react-google-recaptcha-v3';

export default function RegisterFormUI({onSubmit, disableRegisterButton}) {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [password2, setPassword2] = useState();
    const [email, setEmail] = useState();
    const [typingTimeouts, setTypingTimeouts] = useState({});
    const {openAlert} = useContext(GlobalAlertContext);
    const {executeRecaptcha} = useGoogleReCaptcha();
    const [token, setToken] = useState('');

    // True means valid, false means invalid
    const [validations, setValidations] = useState({
        password: true,
        password2: true,
        username: true,
        email: true,
    });

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


    function validate(changedKey, targetValue) {
        let passwordIsValid = validations.password;
        let password2IsValid = validations.password2;
        let userNameIsValid = validations.username;
        let emailIsValid = validations.email;

        //https://www.auditboard.com/blog/nist-password-guidelines/
        const userNameRegex = "^[A-Za-z][A-Za-z0-9_ ]{7,29}$";
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        switch (changedKey) {
            case "password":
                passwordIsValid = targetValue?.length >= 12;
                break;
            case "password2":
                password2IsValid = targetValue === password;
                break;
            case "username":
                userNameIsValid = targetValue?.match(userNameRegex);
                break;
            case "email":
                emailIsValid = targetValue?.match(emailRegex);
                break;
            default:
                //all - so we have no target value... should not be used in onChange as the state change is not guaranteed to be on time of validation...
                passwordIsValid = password?.length >= 12;
                password2IsValid = password === password2;
                userNameIsValid = username?.match(userNameRegex);
                emailIsValid = email?.match(emailRegex);
                break;
        }

        setValidations({
            password: passwordIsValid,
            password2: password2IsValid,
            username: userNameIsValid,
            email: emailIsValid,
        });
        return {
            password: passwordIsValid,
            password2: password2IsValid,
            username: userNameIsValid,
            email: emailIsValid,
        };
    }

    function validateWithTimeout(changedKey, value) {
        if (typingTimeouts[changedKey]) clearTimeout(typingTimeouts[changedKey]);
        // Set a new timeout for delayed validation
        const timeoutId = setTimeout(() => {
            validate(changedKey, value);
        }, 500);
        // Update the timeout ID for this specific input
        setTypingTimeouts((prevTimeouts) => ({...prevTimeouts, [changedKey]: timeoutId}));
    }

    return (
        <>
            <Card variant="outlined" className={`${classes.card} w-[36rem] max-w-full m-3`}>
                <>
                    <CardContent className={"!space-y-3"}>
                        <Typography variant="h5" gutterBottom>
                            Registration of a new user to secure chat 🔒
                        </Typography>
                        <TextField onChange={(e) => {
                            setUsername(() => e.target.value)
                            validateWithTimeout("username", e.target.value);
                        }}
                                   id="Username"
                                   label="Username" variant="filled" className={"w-full"}
                                   error={!(validations.username)}
                                   helperText={!(validations.username) && "Username must be between 7 and 29 characters long, must begin with character and can contain only characters, numbers 0-9 and _."}
                        />
                        <TextField onChange={(e) => {
                            setEmail(() => e.target.value)
                            validateWithTimeout("email", e.target.value);
                        }}
                                   id="Mail"
                                   label="Mail" variant="filled" className={"w-full"} type="email"
                                   error={!(validations.email)}
                                   helperText={!(validations.email) && "Email adress is not valid."}
                        />
                        <TextField onChange={(e) => {
                            setPassword(() => e.target.value)
                            validateWithTimeout("password", e.target.value);
                        }}
                                   id="password"
                                   label="Password" variant="filled" type="password"
                                   autoComplete="current-password" className={"w-full"}
                                   helperText={!(validations.password) && "Password must be longer than 12 characters."}
                                   error={!(validations.password)}
                        />
                        <TextField onChange={(e) => {
                            setPassword2(() => e.target.value)
                            validateWithTimeout("password2", e.target.value);
                        }}
                                   id="password2"
                                   label="Enter password again" variant="filled" type="password"
                                   autoComplete="current-password" className={"w-full"}
                                   helperText={!(validations.password2) && "Passwords don't match."}
                                   error={!(validations.password2)}
                        />
                    </CardContent>
                    <CardContent className={"flex flex-row-reverse"}>
                        <Button
                            disabled={disableRegisterButton}
                            size="large" variant="outlined"
                            onClick={() => {
                                const result = validate();
                                if (result.username && result.email && result.password && result.password2) {
                                    handleReCaptchaVerify().then(() => {
                                        onSubmit(username, password, email, token);
                                    });
                                } else {
                                    openAlert("Registration form is not valid. Please fix errors before proceeding.", "error")
                                }
                            }
                            }
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
        </>
    )
}