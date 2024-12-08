import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import {Popover, Typography} from "@mui/material";
import {useState} from "react";

export function PopoverContactButton({contact, setContactMap}) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handlePopoverOpen = (event) => {
        if(!contact.publicKey) {
            setAnchorEl(event.currentTarget);
        }
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (<div><ListItem disablePadding
                           onMouseEnter={handlePopoverOpen}
                           onMouseLeave={handlePopoverClose}>
        <ListItemButton disabled={contact.publicKey == null} onClick={() => {
            setContactMap((prevState) => {
                if (prevState.map.has(contact.username)) {
                    return prevState;
                }
                const newMap = new Map(prevState.map);
                newMap.set(contact.username, contact)
                return {
                    map: newMap,
                    list: [...prevState.list, contact]
                }
            });
        }}>
            <ListItemText primary={contact.username}/>
        </ListItemButton>
    </ListItem>
        {contact.publicKey == null && <Popover
            id="mouse-over-popover"
            sx={{pointerEvents: 'none'}}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
        >
            <Typography sx={{p: 1}}>Can&#39;t add user to conversation - user <Typography color={"primary"} variant={"span"}>{
                <b>{contact.username}</b>}</Typography> has no public key set.</Typography>
        </Popover>}
    </div>);
}