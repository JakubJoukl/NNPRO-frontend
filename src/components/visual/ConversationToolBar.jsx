import Toolbar from "@mui/material/Toolbar";
import {AppBar, MenuItem, Paper, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {useState} from "react";
import {ControlledDraggableDialog} from "./ControlledDraggableDialog.jsx";
import {FingerprintDialogContent} from "./FingerprintDialogContent.jsx";
import {ContactsList} from "../functional/contactsList.jsx";

export function ConversationToolBar({conversation, decryptedKey}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [fingerPrintDialogOpen, setFingerprintDialogOpen] = useState(false);
    const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);


    const handleMenuClick = (event) => {
        setMenuOpen((prevState => !prevState));
    };

    const handleMenuClose = () => {
        setMenuOpen(false);
    };

    const handleOnAddUserDialog = () => {
        setAddUserDialogOpen(true);
        setMenuOpen(false);
    };

    function handleOnShowFingerprints() {
        handleMenuClose();
        setFingerprintDialogOpen(true);
    }

    let menuClassNames = "absolute right-0 z-50 p-2"
    if (!menuOpen) {
        menuClassNames += " invisible hidden"
    }

    function renderKeyFingerprintDialog() {
        return <ControlledDraggableDialog title={"Current fingerprints"}
                                          Content={<FingerprintDialogContent conversation={conversation} className={"min-h-128 max-h-screen"} decryptedKey={decryptedKey}/>}
                                          dialogButtonContent={"Fingerprints"}
                                          open={fingerPrintDialogOpen}
                                          setOpen={setFingerprintDialogOpen}
        />
    }

    function renderAddUserDialog() {
        return <ControlledDraggableDialog title={"Add new user to conversation"}
                                          Content={<ContactsList />}
                                          dialogButtonContent={"Add new user to conversation"}
                                          open={addUserDialogOpen}
                                          setOpen={setAddUserDialogOpen}
        />
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
                    <MenuItem color={"primary"} onClick={handleOnAddUserDialog}>Add user to conversation</MenuItem>
                    <MenuItem color={"primary"} onClick={handleOnShowFingerprints}>Show key fingerprints</MenuItem>
                    <MenuItem color={"primary"} onClick={handleMenuClose}>Leave conversation</MenuItem>
                    {renderKeyFingerprintDialog()}
                    {renderAddUserDialog()}
                </Paper>
            </div>
        </Toolbar>
    </AppBar>
}