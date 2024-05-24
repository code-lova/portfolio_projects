import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";


const ViewChef = () => {

    const [btnLoading, setBtnLoading] = useState(false);

    const { id } = useParams();

    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState({
        address: [           // Initialize address with an empty object
            {
                street: '',
                city: '',
                country: ''
            }
        ]
    });

    useEffect(() => {

        getUserDetails();

    },[id]);

    const getUserDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/editchef/${id}`);
            const { status, userData } = response.data; // Destructure user data from response
            if (status === 200) {
                setUser(userData);
            } else {
                toast.error('Unable to fetch Chef details');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching Chef details:', error);
            toast.error('Unable to fetch Chef details');
        }
    };

   

    const handleInput = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            address: prevUser.address.length > 0 ? [{ ...prevUser.address[0], [name]: value }] : [],
            [name]: value
        }));
    };

   

    const SubmitUpdateUser = async(e) => {
        e.preventDefault();
        setBtnLoading(true);

        const data = user;

        try{
            
            const response  = await axios.put(`http://localhost:3000/api/updatechef/${id}`, data);

            const {status, message} = response.data;

            switch(status) {

                case 200:
                    toast.success(message, {
                        theme: 'colored'
                    });
                    break;
                case 422:
                    toast.warning(message, {
                        theme: 'colored'
                    });
                    break;
                case 404:
                case 500:
                    toast.error(message, {
                        theme: 'colored'
                    });
                    break;
                default:
                    console.error("unexpected response status", status)
            }

        }catch(error){
            console.error("Error Update Chef's Information:", error)
        }
        setBtnLoading(false); // Set Btnloading to false after form submission

    }


    if(loading){
        return(
            <h3 className="admin-main-content">Loading...</h3>
        )
    }



    return(
        <div>
            <div className="admin-main-content">
                <h2>Edit Username
                    <Link to="/admin/chefs">
                        <span className="other-h2-span">Go Back</span>
                    </Link>
                </h2>

                <div className="admin-display">
                    <div className="user-card">
                        <div className="other-header">
                            <h3>Chef Details</h3>
                        </div>
                        <div className="other-body">

                            <form onSubmit={SubmitUpdateUser}>
                                <div className="group-12">
                                    <div className="forms-groups">
                                        <label htmlFor="name">Full Name</label>
                                        <input type="text" name="name" onChange={handleInput} value={user.name}/>
                                    </div>

                                    <div className="forms-groups">
                                        <label htmlFor="email">Email</label>
                                        <input type="text" name="email" onChange={handleInput} value={user.email} />
                                    </div>
                                </div>

                                <div className="group-12">
                                    <div className="forms-groups">
                                        <label htmlFor="location">Username</label>
                                        <input name="username" type="text" onChange={handleInput} value={user.username} />
                                    </div>

                                    <div className="forms-groups">
                                        <label htmlFor="status">Status:</label>
                                        <select name="status" onChange={handleInput} value={user.status}>
                                            <option value="1">Active</option>
                                            <option value="0">Block</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="group-12">
                                    <div className="forms-groups">
                                    <label htmlFor="city">Street</label>
                                    {user.address.length > 0 && user.address[0] ? (
                                            <input name="street" type="text" onChange={handleInput} value={user.address[0].street} />
                                        ) : (
                                            <input name="street" type="text" onChange={handleInput} />
                                        )}
                                    </div>

                                    <div className="forms-groups">
                                        <label htmlFor="city">City</label>
                                        {user.address.length > 0 && user.address[0] ? (
                                            <input name="city" type="text" onChange={handleInput} value={user.address[0].city} />
                                        ) : (
                                            <input name="city" type="text" onChange={handleInput} />
                                        )}
                                    </div>
                                </div>

                                <div className="group-12">
                                    <div className="forms-groups">
                                        <label htmlFor="location">Country</label>
                                        {user.address.length > 0 && user.address[0] ? (
                                            <input name="country" type="text" onChange={handleInput} value={user.address[0].country} />
                                        ) : (
                                            <input name="country" type="text" onChange={handleInput} />
                                        )}
                                    </div>

                                    <div className="forms-groups">
                                        <label htmlFor="category-name">Ip Address</label>
                                        <input type="text" name="iPAddress" readOnly value={user.iPAddress}/>
                                    </div>
                                </div>

                               
                                <div className="forms-groups">
                                    <label htmlFor="category-name">Short Description:</label>
                                    <textarea name="description" cols="30" rows="10" onChange={handleInput} value={user.description}></textarea>
                                </div>

                                <div className="group-6">
                                    <button type="submit" disabled={btnLoading}>{btnLoading ? 'Updating...' : 'Update Chef Info'}</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>

            </div>

        </div>


    );

}

export default ViewChef;
