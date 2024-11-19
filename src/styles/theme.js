import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#000080FF',
        },
        secondary: {
            main: '#4747d4',
        },
        messageForeign: {
            main: '#8080FF',
        },
        messageOwn: {
            main: '#00bcbc',
        },
        messageError: {
            main: '#b22222',
            secondary: '#FFFFFF'
        },
    }
});

export default theme;