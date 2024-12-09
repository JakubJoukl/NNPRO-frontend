import {Button, Typography} from "@mui/material";
import {useContext, useState} from "react";
import {FormContext} from "../../context/formContext.js";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import KeyIcon from '@mui/icons-material/Key';
import {styled} from "@mui/system";
import {generateElipticKeyPair} from "../helpers/cryptographyHelper.js";
import {GlobalAlertContext} from "../../context/globalAlertContext.js";
import {TextareaAutosize} from '@mui/base/TextareaAutosize';
import {UserContext} from "../../context/userContext.js";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export function PrivatePublicKeyField({id, label, className, centerButtons}) {
    const {formRef} = useContext(FormContext);
    const [value, setValue] = useState(JSON.stringify(formRef.current[id]?.value, null, 2));
    const {openAlert} = useContext(GlobalAlertContext);
    const {userContext, setUserContext} = useContext(UserContext);

    async function generateKeyPair() {
        const keyPair = await generateElipticKeyPair();
        const publicKey = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
        const privateKey = await crypto.subtle.exportKey("jwk", keyPair.privateKey);

        // Convert the public key to JSON string
        const privateKeyJson = JSON.stringify(privateKey, null, 2);
        const publicKeyJson = JSON.stringify(publicKey, null, 2);


        // Create a Blob from the JSON string
        const blob = new Blob([privateKeyJson], {type: "application/json"});
        const url = URL.createObjectURL(blob);

        // Create an anchor element and trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.download = "privateKey.json"; // Name of the downloaded file
        link.click(); // Open download dialog

        // Clean up the Blob URL
        URL.revokeObjectURL(url);
        link.remove();

        setUserContext(prevContext => {
            return {
                ...prevContext,
                privateKey: privateKey
            }
        });

        return {publicKeyJson, publicKey};
    }

    let buttonClassNames = "flex flex-row items-center space-x-3";
    if (centerButtons) {
        buttonClassNames += " justify-center"
    }
    return (
        <div className={className}>
            <div className={"space-y-3"}>
                <div className={buttonClassNames}>
                    <Typography variant="p">
                        {label}
                    </Typography>
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon/>}
                    >
                        Upload public key
                        <VisuallyHiddenInput
                            type="file"
                            onChange={(event) => {
                                const reader = new FileReader(); // Create a new FileReader instance

                                // Define the onload event of FileReader
                                reader.onload = (e) => {
                                    const key = e.target.result;
                                    setValue(key);
                                    openAlert("Public key was uploaded successfully.");
                                    formRef.current.publicKey = {
                                        value: JSON.parse(key),
                                        edited: true
                                    };
                                };
                                // Read file as text
                                reader.readAsText(event.target.files[0]);
                            }}
                        />
                    </Button>
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        startIcon={<KeyIcon/>}
                        onClick={
                            async () => {
                                const {publicKeyJson, publicKey} = await generateKeyPair();
                                setValue(publicKeyJson);
                                openAlert("Keypair successfully generated. Private key has been downloaded and also stored in client. Public key has been saved to form. You still need to submit form to apply changes!");
                                formRef.current.publicKey = {
                                    value: JSON.parse(publicKeyJson),
                                    edited: true
                                };
                            }
                        }
                    >
                        Generate keypair
                    </Button>
                </div>
                <TextareaAutosize
                    className="w-full text-sm font-sans font-normal leading-5 px-3 py-2 rounded-lg shadow-md shadow-slate-100  focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300 hover:border-purple-500 focus:border-purple-500 bg-white text-slate-900 focus-visible:outline-0 box-border"
                    placeholder="Your public key will be displayed here"
                    disabled={true}
                    value={value}
                />
            </div>
        </div>);
}