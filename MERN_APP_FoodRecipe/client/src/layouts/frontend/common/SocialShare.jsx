import React from "react";
import { Link } from "react-router-dom";

const SocialShare = () => {
    return(
        <div>
            <div className="media-share">
                <Link to="https://www.facebook.com"><i className="fab fa-facebook fa-2x"></i></Link>
                <Link to="https://www.instagram.com"><i className="fab fa-instagram fa-2x"></i></Link>
                <Link to="https://twitter.com"><i className="fab fa-twitter fa-2x"></i></Link>
            </div>
        </div>
    );
}

export default SocialShare;
