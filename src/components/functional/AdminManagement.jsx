import {AdminWidgetContext} from "../../context/adminWidgetContext.js";
import {useState} from "react";
import {AddAdminDialog} from "../visual/addAdminDialog.jsx";
import {AdminList} from "./adminList.jsx";

export function AdminManagement() {
    const [admins, setAdmins] = useState([]);
    const [adminFilter, setAdminFilter] = useState("");

    return (<AdminWidgetContext.Provider value={{admins, setAdmins, adminFilter, setAdminFilter}}>
        <div className={"text-center p-3 w-full 2xl:w-[50rem] lg:w-[43rem]"}>
            <AddAdminDialog/>
            <AdminList/>
        </div>
    </AdminWidgetContext.Provider>);
}