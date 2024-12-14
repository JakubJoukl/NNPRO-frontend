import {Button, Typography} from "@mui/material";

export function DeleteContactBody({contact, onSubmit, status}) {
    return (<div className={"flex flex-col items-center justify-center"}>
            <Typography textAlign={"center"} className={"m-auto"} sx={{p: 1}}>Are you sure you want to remove contact <Typography color={"primary"} variant={"span"}>{
                    <b>{contact?.username}</b>}</Typography>?</Typography>
            <Button className={"w-fit"} disabled={status?.callInProgress} onClick={() => onSubmit()} variant={"contained"} color={"primary"}>Remove</Button>
        </div>
    )
}