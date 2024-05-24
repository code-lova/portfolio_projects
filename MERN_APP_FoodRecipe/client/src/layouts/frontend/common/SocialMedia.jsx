import React from "react";
import { Link } from "react-router-dom";


const SocialMedia = () => {
    return(
        <div>
            <div className="social-icons">
                <Link to="https://www.facebook.com"><i className="fab fa-facebook"></i></Link>
                <Link to="https://www.instagram.com"><i className="fab fa-instagram"></i></Link>
                <Link to="https://twitter.com"><i className="fab fa-twitter"></i></Link>
            </div>
        </div>
    );
}

export default SocialMedia;
