import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import RouterRoot from './routerRoot.jsx'
import "../index.css"
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {ThemeProvider} from "@mui/material";
import theme from "./styles/theme.js";
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
import {Constants} from "./constants/constants.js";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <GoogleReCaptchaProvider reCaptchaKey={Constants.recaptchaKey}>
                <RouterRoot/>
            </GoogleReCaptchaProvider>
        </ThemeProvider>
    </StrictMode>,
)