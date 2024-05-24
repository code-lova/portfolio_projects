import React, { useEffect, useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import HomeLogo from '../Home/HomeLogo';
import axios from 'axios';

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate()

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    const closeManu = () => {
        setIsOpen(false);
    }

    const handleNavigation = (path) => {
        closeManu();
        navigate(path);
    }


    //Submit logout function 
    const submitLogout = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:3000/auth/logout`).then(res => {
            if(res.data.status === 200){

                navigate('/login');
            }
        }).catch(err => {
            console.log(err)
        })
    }


    //To check if any user is currently logged in..
    const [isLoading, setIsLoading] = useState(true);
    const [isLoddedIn, setIsLoggedIn] = useState(false);
    
    useEffect(() => {

        axios.get(`http://localhost:3000/auth/checkifloggedin`).then(res => {

            if(res.data.status === 200)
            {
                setIsLoggedIn(true);
            }
            setIsLoading(false);
        }).catch(error => {
            console.log(error);
        });

    }, [])

    if(isLoading){
        return (
            <h3> Loading...</h3>
        );
    }

    let NavBarHTML = "";

    if(isLoddedIn){

        NavBarHTML= (
            <div>
                <nav>
                    <HomeLogo />
                    <div>
                        <ul className={`nav-links ${isOpen ? "is-open" : " "}`}>
                            <li><Link to="/" onClick={() => handleNavigation("/")} className='active'>Home</Link></li>
                            <li><Link to="/saved-recipe" onClick={() => handleNavigation("/saved-recipe")}>Saved Recipe</Link></li>
                            <li><Link to="/search" onClick={() => handleNavigation("/search")}>Search</Link></li>
                            <li><Link to="/contact" onClick={() => handleNavigation("/contact")}>Contact</Link></li>
                        </ul>
                    </div>

                    <div className='ttp'>
                        <ul className={`nav-links ${isOpen ? "is-open" : " "}`}>
                            <li><Link to="/logout" onClick={submitLogout} className='btn-reg'>Logout</Link></li>
                        </ul>
                    </div>
                    <div className={`handburger-menu ${isOpen ? 'show' : ''}`} onClick={toggleMenu}></div>
                </nav>
            </div>
        )
    }else{

        NavBarHTML = (
            <div>
                <nav>
                    <HomeLogo />
                    <div>
                        <ul className={`nav-links ${isOpen ? "is-open" : " "}`}>
                            <li><Link to="/" onClick={() => handleNavigation("/")} className='active'>Home</Link></li>
                            <li><Link to="/saved-recipe" onClick={() => handleNavigation("/saved-recipe")}>Saved Recipe</Link></li>
                            <li><Link to="/search" onClick={() => handleNavigation("/search")}>Search</Link></li>
                            <li><Link to="/contact" onClick={() => handleNavigation("/contact")}>Contact</Link></li>
                        </ul>
                    </div>

                    <div className='ttp'>
                        <ul className={`nav-links ${isOpen ? "is-open" : " "}`}>
                            <li><Link to="/login"  onClick={() => handleNavigation("/login")}>Login</Link></li>
                            <li><Link to="/register" onClick={() => handleNavigation("/register")} className='btn-reg'>Sign Up</Link></li>
                        </ul>
                    </div>
                    <div className={`handburger-menu ${isOpen ? 'show' : ''}`} onClick={toggleMenu}></div>
                </nav>
            </div>
        )
    }

    return (
        <div>
            {NavBarHTML}
        </div>
       
    )
}

export default Navbar