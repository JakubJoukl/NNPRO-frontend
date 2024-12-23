import {Button} from "@mui/material";

export function ConfirmationDialog({TextComponent, onSubmit, status, children, confirmationText}) {
    return (<div className={"flex flex-col items-center justify-center"}>
            {children}
            <Button className={"w-fit"} disabled={status?.callInProgress} onClick={() => onSubmit()}
                    variant={"contained"} color={"primary"}>{confirmationText}</Button>
        </div>
    )
}