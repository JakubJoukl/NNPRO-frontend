import {Alert, Button, CircularProgress, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {computeFingerprint, importPublicKey} from "../helpers/cryptographyHelper.js";

export function FingerprintDialogContentUI({decryptedKey, conversationUsers, status, resetErr}) {
    const [fingerPrints, setKeyFingerprints] = useState({});

    useEffect(() => {
            if (status.callFinished) {
                (async () => {
                    let symmetricKey;
                    try {
                        symmetricKey = await computeFingerprint(decryptedKey);
                    } catch (e) {
                        symmetricKey = "Failed to calculate!"
                        console.error(e);
                    }
                    const publicKeys = [];
                    for (const user of conversationUsers ?? []) {
                        let fingerPrint = "Failed to compute fingerprint!";
                        try {
                            const key = await importPublicKey(user.publicKey);
                            const rawKey = await window.crypto.subtle.exportKey("raw", key);
                            fingerPrint = await computeFingerprint(rawKey);
                        } catch (e) {
                            console.error(e);
                            fingerPrint = "Failed to calculate!"
                        }
                        publicKeys.push({key: fingerPrint, username: user.username});
                    }

                    setKeyFingerprints({symmetricKey, publicKeys});
                })()
            }
        }, [conversationUsers, decryptedKey, setKeyFingerprints, status.callFinished]
    );

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
        {status.callInProgress &&
            <div key={"progressCircle"} className={"flex !justify-center mt-3 flex-row"}>
                <CircularProgress className={'ml-3'} color="primary"/>
            </div>
        }
        {status.isError && <><Alert
            severity={"error"}
            variant="filled"
            sx={{width: '100%'}}
        >
            Error occurred during listing of conversation user public keys.
        </Alert>
            <Button
                size="large" variant="outlined"
                onClick={() => {
                    resetErr()
                }
                }
                color={"primary"}
            >Refresh</Button>
        </>}
        {!status.callInProgress && fingerPrints.publicKeys?.map((item) => {
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