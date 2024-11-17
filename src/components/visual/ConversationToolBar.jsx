import Toolbar from "@mui/material/Toolbar";
import {AppBar, MenuItem, Paper, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import * as React from "react";
import {useState} from "react";

export function ConversationToolBar({conversation}) {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenuClick = (event) => {
        setMenuOpen((prevState => !prevState));
    };

    const handleMenuClose = () => {
        setMenuOpen(false);
    };
    let menuClassNames = "absolute right-0 z-50 p-2"
    if (!menuOpen) {
        menuClassNames += " invisible hidden"
    }

    return <AppBar position={"relative"} color={"secondary"}>
        <Toolbar>
            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                {conversation.name}
            </Typography>


            <div style={{marginLeft: "auto"}} className={"overflow-auto"}>
                <IconButton
                    size="large"
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    sx={{mr: 2}}
                    onClick={(event) => handleMenuClick(event)}
                >
                    <MoreVertIcon/>
                </IconButton>
                <Paper
                    id="basic-menu"
                    onClose={handleMenuClose}
                    className={menuClassNames}
                    square
                >
                    <MenuItem color={"primary"} onClick={handleMenuClose}>Add user to conversation</MenuItem>
                    <MenuItem color={"primary"} onClick={handleMenuClose}>Leave conversation</MenuItem>
                </Paper>
            </div>
        </Toolbar>
    </AppBar>
}