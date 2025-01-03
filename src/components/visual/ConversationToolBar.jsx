import Toolbar from "@mui/material/Toolbar";
import {AppBar, Button, MenuItem, Paper, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {useState} from "react";
import {ControlledDraggableDialog} from "./ControlledDraggableDialog.jsx";
import {AddUserToConversationBody} from "../functional/addUserToConversationBody.jsx";
import {LeaveConversationBody} from "../functional/leaveConversationBody.jsx";
import {ShowConversationParticipants} from "./showConversationParticipants.jsx";
import {RotateSymmetricKey} from "../functional/RotateSymmetricKey.jsx";
import {FingerPrintDialogContent} from "../functional/FingerPrintDialogContent.jsx";

export function ConversationToolBar({conversation, decryptedKey, fetchConversation}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [fingerPrintDialogOpen, setFingerprintDialogOpen] = useState(false);
    const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
    const [leaveConversationDialogOpen, setLeaveConversationDialogOpen] = useState(false);
    const [showParticipantsDialog, setShowParticipantsDialog] = useState(false);
    const [rotateSymmetricKeyDialogOpen, setRotateSymmetricKeyDialogOpen] = useState(false);

    //TODO success message

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

    function handleOnLeaveConversationOpen() {
        handleMenuClose();
        setLeaveConversationDialogOpen(true);
    }

    function handleOnShowParticipants() {
        handleMenuClose();
        setShowParticipantsDialog(true);
    }

    function handleOnRotateSymmetricKey() {
        handleMenuClose();
        setRotateSymmetricKeyDialogOpen(true);
    }

    let menuClassNames = "absolute right-0 z-50 p-2"
    if (!menuOpen) {
        menuClassNames += " invisible hidden"
    }

    function renderKeyFingerprintDialog() {
        return <ControlledDraggableDialog title={"Current fingerprints"}
                                          Content={<FingerPrintDialogContent conversation={conversation}
                                                                               className={"min-h-128 max-h-screen"}
                                                                               decryptedKey={decryptedKey}/>}
                                          dialogButtonContent={"Fingerprints"}
                                          open={fingerPrintDialogOpen}
                                          setOpen={setFingerprintDialogOpen}
        />
    }

    function renderAddUserDialog() {
        return <ControlledDraggableDialog title={"Add new user to conversation"}
                                          Content={<AddUserToConversationBody decryptedKey={decryptedKey}
                                                                              conversation={conversation}
                                                                              onSubmit={() => setAddUserDialogOpen(false)}/>}
                                          dialogButtonContent={"Add new user to conversation"}
                                          open={addUserDialogOpen}
                                          setOpen={setAddUserDialogOpen}
        />
    }

    function renderLeaveConversationDialog() {
        return <ControlledDraggableDialog title={"Leave conversation"}
                                          Content={<LeaveConversationBody conversation={conversation}
                                                                          onSubmit={() => setLeaveConversationDialogOpen(false)}/>}
                                          dialogButtonContent={"Leave conversation"}
                                          open={leaveConversationDialogOpen}
                                          setOpen={setLeaveConversationDialogOpen}
        />
    }

    function renderConversationUsersDialog() {
        return <ControlledDraggableDialog title={"Conversation participants"}
                                          Content={<ShowConversationParticipants users={conversation.users}
                                                                                 onSubmit={() => setShowParticipantsDialog(false)}/>}
                                          dialogButtonContent={"Show conversation participants"}
                                          open={showParticipantsDialog}
                                          setOpen={setShowParticipantsDialog}
        />
    }

    function renderRotateMasterKeysDialog() {
        return <ControlledDraggableDialog title={"Rotate symmetric key"}
                                          Content={<RotateSymmetricKey conversation={conversation}
                                                                       className={"min-h-128 max-h-screen"}
                                                                       decryptedKey={decryptedKey}
                                                                       onSubmit={() => setRotateSymmetricKeyDialogOpen(false)}
                                                                       fetchConversation={fetchConversation}/>}
                                          dialogButtonContent={"Rotate symmetric key"}
                                          open={rotateSymmetricKeyDialogOpen}
                                          setOpen={setRotateSymmetricKeyDialogOpen}
        />
    }

    return <AppBar position={"relative"} color={"secondary"}>
        <Toolbar>
            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                {conversation.name}
            </Typography>


            <div style={{marginLeft: "auto"}} className={"overflow-auto"} onBlur={(e) => {
                if (!e.relatedTarget && menuOpen) handleMenuClose()
            }}>
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
                    <MenuItem color={"primary"} onClick={handleOnShowParticipants}>Show conversation
                        participants</MenuItem>
                    <MenuItem color={"primary"} onClick={handleOnRotateSymmetricKey}>Rotate symmetric key</MenuItem>
                    <MenuItem color={"primary"} onClick={handleOnLeaveConversationOpen}>Leave conversation</MenuItem>
                    {renderKeyFingerprintDialog()}
                    {renderAddUserDialog()}
                    {renderLeaveConversationDialog()}
                    {renderConversationUsersDialog()}
                    {renderRotateMasterKeysDialog()}
                </Paper>
            </div>
        </Toolbar>
    </AppBar>
}