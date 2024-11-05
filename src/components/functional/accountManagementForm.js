import {useEffect, useState} from "react";
import * as Calls from "../../constants/calls.js";
import {AccountManagementFormGui} from "../visual/accountManagementFormGui.js";
import {useCall} from "../hooks/useCall.js";

export function AccountManagementForm() {
    const {dtoOut, status} = useCall("getCurrentUserProfile", {}, {});


    return <AccountManagementFormGui status={status} userInfo={dtoOut}/>
}