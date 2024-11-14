import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import ListItemText from "@mui/material/ListItemText";
import ContactsIcon from "@mui/icons-material/Contacts";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import {useTheme} from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import {ConversationList} from "../functional/conversationList.jsx";

export default function DrawerListBar({drawerWidth, handleDrawerClose, open}) {
    const theme = useTheme();
    const navigate = useNavigate();

    return (<Drawer
        sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
            },
        }}
        variant="persistent"
        anchor="left"
        open={open}
    >
        <c>
            <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'ltr' ? <ChevronLeftIcon color={"primary"}/> : <ChevronRightIcon/>}
            </IconButton>
        </c>
        <Divider/>
        <List>
            <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/newConversation")}>
                    <ListItemIcon>
                        <QuestionAnswerIcon color={"secondary"}/>
                    </ListItemIcon>
                    <ListItemText primary={"New conversation"}/>
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/contacts")}>
                    <ListItemIcon>
                        <ContactsIcon color={"secondary"}/>
                    </ListItemIcon>
                    <ListItemText primary={"Contacts"}/>
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/accountManagement")}>
                    <ListItemIcon>
                        <ManageAccountsIcon color={"secondary"}/>
                    </ListItemIcon>
                    <ListItemText primary={"Account management"}/>
                </ListItemButton>
            </ListItem>
        </List>
        <Divider/>
        <ConversationList/>
    </Drawer>);
}