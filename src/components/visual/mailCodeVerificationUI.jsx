import {Card, CardContent, CircularProgress, IconButton, Typography} from "@mui/material";
import classes from "../../styles/loginForm.module.css";
import OTPInput from "./OTP.jsx";
import {useCallback, useEffect, useRef, useState} from "react";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {ArrowBack} from "@mui/icons-material";

export default function MailCodeVerificationUI({disableSubmit, onSubmit, callInProgress, cancel2FA}) {
    const [otpValue, setOtpValue] = useState('');
    const {executeRecaptcha} = useGoogleReCaptcha();
    const tokenRef = useRef('');
    const codeLength = 6;

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

    // You can use useEffect to trigger the verification as soon as the component being loaded
    useEffect(() => {
        if (otpValue.length === codeLength && !disableSubmit) {
            onSubmit(otpValue, tokenRef.current);
        }
    }, [otpValue]);

    return (
        <Card variant="outlined" className={`${classes.card} w-[36rem] max-w-full m-3 justify-center`}>
            <CardContent className={"!space-y-6"}>
                <div className={'flex row space-x-3'}>
                    <IconButton onClick={() => cancel2FA()} color={"primary"}><ArrowBack/></IconButton>
                    <Typography variant="h5" className={'flex flex-col justify-center !mx-auto pr-12'}>
                        Enter you 2FA verification code
                    </Typography>
                </div>
                <OTPInput disabled={disableSubmit} separator={<span>-</span>} value={otpValue} onChange={setOtpValue}
                          length={codeLength}/>
                {!!callInProgress && <div className={'justify-center align-middle w-full flex'}>
                    <Typography align={"center"} variant="body" className={'flex flex-col justify-center'}>
                        Verifying input code...
                    </Typography><CircularProgress className={'ml-3'} color="primary"/>
                </div>}
            </CardContent>
        </Card>
    );
}