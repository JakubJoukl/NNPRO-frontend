import {TextField} from "@mui/material";
import {useContext, useState} from "react";
import {FormContext} from "../../context/formContext.js";

export function EditableInputTextField({id, label, type, className}) {
    const {formRef} = useContext(FormContext);
    const [value, setValue] = useState(formRef.current[id]?.value);
    const [editMode, setEditMode] = useState(false);

    return (
        <>
            <TextField onChange={(e) => setValue(() => e.target.value)}
                       id={id}
                       label={label} variant="filled" type={type}
                       value={value}
                       disabled={!editMode}
                       autoComplete="current-password" className={className}/>
        </>);
}