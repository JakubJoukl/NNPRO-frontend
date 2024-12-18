import {Button, Typography} from "@mui/material";
import * as React from "react";
import {FingerprintDialogContentUI} from "./FingerprintDialogContentUI.jsx";
import {useContext, useRef, useState} from "react";
import {UserContext} from "../../context/userContext.js";

export function RotateSymmetricKeyUI({conversation, className, decryptedKey, onSubmit}) {
    const [inConfirmation, setInConfirmation] = useState(false);
    const [confirmEnabled, setConfirmEnabled] = useState(false);
    const timeOutRef = useRef();
    const {userContext} = useContext(UserContext);

    function renderActionButtons() {
        if (!inConfirmation) {
            return (
                <Button onClick={() => {
                    setInConfirmation(true);
                    timeOutRef.current = setTimeout(() => {
                        setConfirmEnabled(true);
                    }, 1000);
                }}
                        variant={"contained"}
                        disabled={userContext.privateKey == null}
                        size={"large"}>Rotate</Button>);
        } else {
            return (<div className={"space-x-3"}>
                <Button disabled={!confirmEnabled || userContext.privateKey == null || userContext.publicKey == null}
                        variant={"contained"}
                        onClick={() => onSubmit()}
                        size={"large"}>Confirm</Button>
                <Button onClick={() => {
                    setInConfirmation(false);
                    setConfirmEnabled(false);
                    clearTimeout(timeOutRef.current);
                }}
                        variant={"outlined"} size={"large"}>Cancel</Button>
            </div>);
        }
    }

    return (<div className={"flex flex-col items-start justify-start"}>
            <Typography variant="p" gutterBottom color={"red"}>
                IMPORTANT - Rotation of symmetric key will make old messages indecipherable.
            </Typography>
            <div className={"w-full flex flex-row justify-center"}>
                {renderActionButtons()}
            </div>
            {(userContext.privateKey == null || userContext.publicKey == null) &&
                <Typography variant="p" gutterBottom color={"red"}>
                    You need to upload your private key first in order to rotate symmetric key.
                </Typography>
            }
            <div>
                <FingerprintDialogContentUI conversation={conversation} className={className}
                                            decryptedKey={decryptedKey}/>
            </div>
        </div>
    )
}