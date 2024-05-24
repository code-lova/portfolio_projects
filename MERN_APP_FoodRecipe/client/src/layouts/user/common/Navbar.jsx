import React, { useState, useEffect } from 'react'
import * as FaIcons from "react-icons/fa6";
import * as AiIcons from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import cookingImg from "../../../assets/images/plus.png"
import HomeLogo from '../../frontend/Home/HomeLogo';
import axios from 'axios';





const Navbar = () => {

    const navigate = useNavigate();

    const [sidebar, setSidebar] = useState(false);

    const [subMenu, setSubMenu] = useState(false);

    const toggleSubMenu = () => {
        setSubMenu(!subMenu);
    }

    const toggleSidebar = () => {
        setSidebar(!sidebar);
    }

    //Submit logout function 
    const submitLogout = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:3000/auth/logout`).then(res => {
            if(res.data.status === 200){
                navigate('/')
            }
        }).catch(err => {
            console.log(err)
        })
    }


    const [user, setUser] = useState([]);

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        axios.get('http://localhost:3000/auth/userprofile').then(res => {

        if(res.data.status === 200){
            setUser(res.data)
            setLoading(false);
        }
        else if(res.data.status === 401){
            navigate("/login");
        }

        }).catch(err => {
            console.log(err)

        })


    }, []);


    if(loading)
    {
        return (
            <div>
                <h3>Loading...</h3>
            </div>
        )
    }
    


    return (
        <>
            <div className="navbar">

                <Link to="#" className="menu-bars">
                    <FaIcons.FaBarsStaggered onClick={toggleSidebar}/>
                </Link>

                <div className="site-logo">
                    <HomeLogo />
                </div>

                <ul className="dropdown">

                    <li className="drop-icon envelope-icon">
                        <Link to="#"><FaIcons.FaRegEnvelope /></Link>
                    </li>
                    <li className="drop-icon bell-con">
                        <Link to="#"><FaIcons.FaBell /></Link>
                    </li>

                    <li className="dropdown-item drop-icon">
                        <Link to="#" onClick={toggleSubMenu} className="flex-header-menu">
                            <FaIcons.FaUserLarge />
                            <span>&#9662;</span>
                        </Link>
                        {subMenu && (
                            <ul className="submenu">
                                <li><Link to="#">View/Edit</Link></li>
                                <li><Link to="#">Settings</Link></li>
                                <li><Link to="#" onClick={submitLogout}>Logout</Link></li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
            <div className={sidebar ? "sidebar active" : "sidebar"}>
                <ul className="sidebar-menu-items" onClick={toggleSidebar}>
                    <li>
                        <Link to="#" className="menu-bars for-large">
                            <AiIcons.AiOutlineClose />
                        </Link>
                    </li>
                    <h3>{user.username}</h3>
                    {SidebarData.map((item, index) => {
                        return(
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        )
                    })}

                        <img src={cookingImg} alt="chef-img" loading='lazy'/>
                </ul>
                
            </div> 
                          
        </>
    )

}

export default Navbar