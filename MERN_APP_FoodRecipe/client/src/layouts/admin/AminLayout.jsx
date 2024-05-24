import React from "react";
import "../../small.css";
import "../../large.css";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminFooter from "./AdminFooter";


const AdminLayout = () => {

    return(
        <>
            <AdminNavbar />
            <div className="user-wrapper">
                <Outlet />
            </div>
            <AdminFooter />

        </>


    );

}

export default AdminLayout;
