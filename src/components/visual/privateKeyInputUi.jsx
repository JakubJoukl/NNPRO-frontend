import {Button, Card, CardContent, Typography} from "@mui/material";
import classes from "../../styles/loginForm.module.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {styled} from "@mui/system";

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

export function PrivateKeyInputUI({setLoggedUser}) {
    return <>
        <Card variant="outlined" className={`${classes.card} w-[36rem] max-w-full m-3`}>
            <CardContent className={"!space-y-3"}>
                <Typography variant="h5" gutterBottom>
                    Upload your private key.
                </Typography>
                <Typography variant="p" gutterBottom>
                    Upload your private key to be able to decipher messages.<br/>
                    🔒<b>You private key never leaves your browser.</b>🔒
                </Typography>
            </CardContent>
            <CardContent className={"flex flex-row-reverse"}>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon/>}
                >
                    Upload private key
                    <VisuallyHiddenInput
                        type="file"
                        onChange={(event) => {
                            const reader = new FileReader(); // Create a new FileReader instance

                            // Define the onload event of FileReader
                            reader.onload = (event) => {
                                const key = event.target.result;
                                setLoggedUser((prevState) => {
                                    return {
                                        ...prevState,
                                        privateKey: JSON.parse(key),
                                    }
                                })
                            };
                            // Read file as text
                            reader.readAsText(event.target.files[0]);
                        }}
                    />
                </Button>
            </CardContent>
        </Card>
    </>
}