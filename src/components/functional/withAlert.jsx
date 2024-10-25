import PopUpAlert from "../visual/popUpAlert.jsx";
import {useState} from "react";

export default function WithAlert(OriginalComponent) {

    function NewComponent(props) {
        const [message, setMessage] = useState();
        const [severity, setSeverity] = useState();
        const [open, setOpen] = useState(false);

        function openAlert(message, severity) {
            setSeverity(severity);
            setMessage(message);
            setOpen(true);
        }

        function closeAlert() {
            setOpen(false);
        }

        return <>
            <PopUpAlert open={open} message={message} severity={severity}
                        handleClose={closeAlert}/>
            <OriginalComponent {...props} openAlert={openAlert} closeAlert={closeAlert}/>
        </>;
    }

    return NewComponent;
}