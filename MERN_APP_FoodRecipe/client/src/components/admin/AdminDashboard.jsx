import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa6";
import axios from "axios";

const AdminDashboard = () => {


    const [catNumber, setCatNumber] = useState(0);

    const [userCount, setUserCount] = useState(0);

    const [userDetails, setUserActivity] = useState([]);

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getUserActicity()
    },[]);


    const getUserActicity = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`http://localhost:3000/api/show-user-activity`);
            const { status, countCategory, countUSer, userActivity } = response.data; // Destructure user data from response
            if (status === 200) {
                setCatNumber(countCategory)
                setUserCount(countUSer)
                setUserActivity(userActivity);
            }else{
                console.error("Unexpected response structure", error)
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }finally{
            setLoading(false)
        }
    };



    if(loading){
        return(
            <div className="spinner-container">
                <div className="spinner"></div>
                <h4>Loading...</h4>
            </div>
        )
    }

    //function to clean up the IP address
    const cleanIpAddress = (ip) => {
        return ip.startsWith("::ffff:") ? ip.substring(7) : ip;
    };


    return(
        <div>
            <div className="admin-main-content">
                <h2>Dashboard
                    <span className="login-time">Login time</span>
                </h2>
                <div className="user-large-display">
                    <div className="card-1">
                        <div className="card-header">
                            <h3>Caretgries</h3>
                            <FaIcons.FaList className="icons"/>
                        </div>
                        <div className="card-body">
                            <h3>{catNumber}</h3>
                        </div>
                    </div>
                    <div className="card-2">
                        <div className="card-header">
                            <h3>Users</h3>
                            <FaIcons.FaUserCheck className="icons"/>
                        </div>
                        <div className="card-body">
                            <h3>{userCount}</h3>
                        </div>
                    </div>

                </div>

                <div className="admin-display">
                    <div className="user-card">
                        <div className="other-header">
                            <h3>Chefs Activity</h3>
                        </div>
                        <div className="other-body">
                            <div className="table-container">
                                <table className="responsive-table">
                                    <thead>
                                        <tr>
                                            <th>S/N</th>
                                            <th>Chef Name</th>
                                            <th>Chef Email</th>
                                            <th>Created at</th>
                                            <th>IP Address</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userDetails.length > 0 ?
                                            (
                                                userDetails.map((data, i) => (
                                                    (
                                                        <tr key={i}>
                                                            <td>{i + 1}</td>
                                                            <td>{data.name}</td>
                                                            <td>{data.email}</td>
                                                            <td>{new Date(data.createdAt).toLocaleDateString()}</td>
                                                            <td>{cleanIpAddress(data.iPAddress || 'N/A')}</td>
                                                            <td>{data.isLoggedIn ? 'Logged In' : 'Logged Out'}</td>
                                                        </tr>
                                                    )
                                                ))
                                            ):(
                                                <tr>
                                                    <td className="no-data-available" colSpan="5">There are not categories available</td>
                                                </tr>
                                            )
                                        
                                        }

                                       
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default AdminDashboard;
