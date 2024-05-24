import React from "react";
import HomeLogo from "../Home/HomeLogo";
import { Link } from "react-router-dom";
import SocialMedia from "./SocialMedia";

const Footer = () => {

    return(
        <div>
            <div className="footer">

                <div className="footer-logo">
                    <HomeLogo />
                </div>

                <SocialMedia />

            </div>

            <div className="footer-content">
                <div>
                    <ul className="text-small">
                        <li><Link className="link-text" to="">Presentations</Link></li>
                        <li><Link className="link-text" to="">Professionals</Link></li>
                        <li><Link className="link-text" to="">Stores</Link></li>
                    </ul>
                </div>
                <div>
                    <ul className="text-small">
                        <li><Link className="link-text" to="">Webinars</Link></li>
                        <li><Link className="link-text" to="">Workshops</Link></li>
                        <li><Link className="link-text" to="">Local Meetups</Link></li>
                    </ul>
                </div>
                <div>
                    <ul className="text-small">
                        <li><Link className="link-text" to="">Our Initiatives</Link></li>
                        <li><Link className="link-text" to="">Giving Back</Link></li>
                        <li><Link className="link-text" to="">Communities</Link></li>
                    </ul>
                </div>
                <div>
                    <ul className="text-small">
                        <li><Link className="link-text" to="">Contact Form</Link></li>
                        <li><Link className="link-text" to="">Work With Us</Link></li>
                        <li><Link className="link-text" to="">Visit Us</Link></li>
                    </ul>
                </div>
            </div>

            <div className="text-muted">				
			    <div>Made by <Link className="link-muted" to="https://github.com/code-lova" target="_blank">#Code-Love$</Link> in Benin City.</div>
		    </div>

        </div>


    );

}

export default Footer;
