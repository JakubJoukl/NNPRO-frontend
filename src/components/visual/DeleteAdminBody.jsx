import {Button, Typography} from "@mui/material";

export function DeleteAdminBody({admin, onSubmit, status}) {
    return (<div className={"flex flex-col items-center justify-center"}>
            <Typography textAlign={"center"} className={"m-auto"} sx={{p: 1}}>Are you sure you want to remove admin <Typography color={"primary"} variant={"span"}>{
                <b>{admin?.username}</b>}</Typography>?</Typography>
            <Button className={"w-fit"} disabled={status?.callInProgress} onClick={() => onSubmit()} variant={"contained"} color={"primary"}>Remove</Button>
        </div>
    )
}