import React from "react";
import { Outlet } from "react-router-dom";
import "../../small.css";
import "../../large.css";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";


const UserLayout = () => {

    return(
        <>
            <Navbar />
            <div className="user-wrapper">
                <Outlet />
            </div>
            <Footer />
            
        </>
    );

}

export default UserLayout;
