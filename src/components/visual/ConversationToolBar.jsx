import Toolbar from "@mui/material/Toolbar";
import {AppBar, MenuItem, Typography} from "@mui/material";
import {Menu} from "@mui/base";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import * as React from "react";

export function ConversationToolBar({conversation}){
    const [anchorEl, setAnchorEl] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return <AppBar position={"relative"} color={"secondary"}>
        <Toolbar>
            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                {conversation.name}
            </Typography>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                <MenuItem onClick={handleMenuClose}>My account</MenuItem>
                <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            </Menu>

            <div style={{marginLeft: "auto"}}>
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
            </div>
        </Toolbar>
    </AppBar>
}