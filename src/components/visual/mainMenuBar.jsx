import * as React from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import DrawerListBar from "./DrawerListBar.jsx";
import {DraggableDialog} from "./DraggableDialog.jsx";
import {Button} from "@mui/material";
import {useContext} from "react";
import {UserContext} from "../../context/userContext.js";
import FormManagementDialogContent from "../functional/formManagementDialog.jsx";

const drawerWidth = 240;

const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme}) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        variants: [
            {
                props: ({open}) => open,
                style: {
                    transition: theme.transitions.create('margin', {
                        easing: theme.transitions.easing.easeOut,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    marginLeft: 0,
                },
            },
        ],
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({theme}) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({open}) => open,
            style: {
                width: `calc(100% - ${drawerWidth}px)`,
                marginLeft: `${drawerWidth}px`,
                transition: theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function MainMenuBar({children, routeHeader}) {
    const [open, setOpen] = React.useState(true);
    const {userContext, setUserContext} = useContext(UserContext);
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    function renderKeyManagementDialog(){
        return <DraggableDialog title={"Key management"}
                                Content={<FormManagementDialogContent/>}
                                dialogButtonContent={"Change keypair"}
                                className={"h-128 max-h-screen"}
                                OpenDialogButton={Button}
                                buttonOptions={{variant: "contained", color: "secondary"}}
        />
    }

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={[
                            {
                                mr: 2,
                            },
                            open && {display: 'none'},
                        ]}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="span" noWrap className={"flex-grow"}>
                        Logged user: {userContext.username}
                    </Typography>
                    {
                        renderKeyManagementDialog()
                    }
                </Toolbar>
            </AppBar>
            <DrawerListBar drawerWidth={drawerWidth} handleDrawerClose={handleDrawerClose} open={open}/>
            <Main open={open} className={"flex flex-col h-screen"}>
                <DrawerHeader/>
                {children}
            </Main>
        </Box>
    );
}