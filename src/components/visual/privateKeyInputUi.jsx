import {Button, Container, Typography} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {styled} from "@mui/system";
import {useContext} from "react";
import {UserContext} from "../../context/userContext.js";
import {importPrivateKey} from "../helpers/cryptographyHelper.js";
import {GlobalAlertContext} from "../../context/globalAlertContext.js";
import CircleIcon from '@mui/icons-material/Circle';

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

export function PrivateKeyInputUI() {
    const {userContext, setUserContext} = useContext(UserContext);
    const {openAlert, closeAlert} = useContext(GlobalAlertContext);

    return <Container className={"space-y-6 flex flex-col"}>
        <Typography variant="h5">
            Upload your private key.
        </Typography>
        <Typography variant="p" gutterBottom>
            Upload your private key to be able to decipher messages.<br/>
            🔒<b>You private key never leaves your browser.</b>🔒
        </Typography>
        <Button
            className={"w-fit !mr-auto !ml-auto"}
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon/>
        }>
            Upload private key
            <VisuallyHiddenInput
                type="file"
                onChange={(event) => {
                    const reader = new FileReader(); // Create a new FileReader instance

                    // Define the onload event of FileReader
                    reader.onload = async (event) => {
                        const key = event.target.result;
                        try {
                            const parsedKey = JSON.parse(key);
                            await importPrivateKey(parsedKey);
                            setUserContext((prevState) => {
                                return {
                                    ...prevState,
                                    privateKey: parsedKey,
                                }
                            });
                            openAlert("Private key uploaded successfully.");
                        } catch (e) {
                            openAlert("Importing of private key was not successful. Verify that key is valid private key in P-521 format.","error");
                        }
                    };
                    // Read file as text
                    reader.readAsText(event.target.files[0]);
                }}
            />
        </Button>
        <div className={"flex justify-start items-stretch"}><Typography variant="span" className={"flex justify-start items-center"}>
            Key upload status: <CircleIcon color={userContext.privateKey? "success": "error"}/>.
        </Typography>
        </div>
    </Container>
}