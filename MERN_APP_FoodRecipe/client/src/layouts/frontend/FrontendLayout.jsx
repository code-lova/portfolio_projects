import React from "react";
import '../../small.css';
import '../../large.css';
import { Outlet } from "react-router-dom";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";

const FrontendLayout = () => {

    return(
        <div className="wrapper">
            <Navbar />
            <Outlet />
            <Footer />

        </div>


    );

}

export default FrontendLayout;
