import {Typography} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../../context/userContext.js";
import {base64ToUint8Array, computeFingerprint, importPublicKey} from "../helpers/cryptographyHelper.js";
import * as React from "react";

export function FingerprintDialogContent({conversation, className, decryptedKey}) {
    const {userContext, setUserContext} = useContext(UserContext);
    const [fingerPrints, setKeyFingerprints] = useState({});

    useEffect(() => {
        (async () => {
            const symmetricKey = await computeFingerprint(decryptedKey);
            const publicKeys = [];
            for (const user of conversation.users) {
                let fingerPrint = "Failed to compute fingerprint!";
                try {
                    const key = await importPublicKey(user.cipheringPublicKey);
                    const rawKey = await window.crypto.subtle.exportKey("raw", key);
                    fingerPrint = await computeFingerprint(rawKey);
                } catch (e) {
                    console.error(e);
                }
                publicKeys.push({key: fingerPrint, username: user.username});
            }

            setKeyFingerprints({symmetricKey, publicKeys});
        })()
    }, [conversation.users, decryptedKey, setKeyFingerprints]);

    return (<div className={"flex flex-col"}>
        <div>
            <Typography variant="span">All fingerprints are in <b>SHA-256 format</b>.</Typography>
        </div>
        <div>
            <Typography variant="span" gutterBottom>Symmetric key fingerprint: <Typography
                fontWeight={"bold"}
                variant="span"
                color={"primary"}>{fingerPrints.symmetricKey ?? "Not calculated yet!"}</Typography>
            </Typography>
        </div>
        {fingerPrints.publicKeys?.map((item) => {
            return (<div key={item.username}>
                <Typography variant="span" gutterBottom>Public key of user <Typography
                    fontWeight={"bold"}
                    variant="span"
                    color={"secondary"}>{item.username}</Typography>: <Typography
                    variant="span"
                    fontWeight={"bold"}
                    color={"primary"}>{item.key}</Typography>
                </Typography>
            </div>);
        })}
    </div>)
}