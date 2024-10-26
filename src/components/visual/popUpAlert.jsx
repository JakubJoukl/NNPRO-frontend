import {Alert, Snackbar} from "@mui/material";

export default function PopUpAlert({message, severity, open, handleClose}) {
    return (
        <Snackbar open={open}
                  anchorOrigin={{
                      vertical: "top",
                      horizontal: "center",
                  }
                  }
        >
            <Alert
                onClose={() => handleClose()}
                severity={severity}
                variant="filled"
                sx={{width: '100%'}}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}