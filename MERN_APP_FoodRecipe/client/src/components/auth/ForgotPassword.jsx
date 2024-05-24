import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import loginImg from "../../assets/images/photo-1556911220-e15b29be8c8f0e89.jpg";
import HomeLogo from "../../layouts/frontend/Home/HomeLogo";

const ForgotPassword = () => {

    const [forgotPassword, setForgotPassword] = useState({
        email: ''
    })

    const [loading, setLoading] = useState(false);


    const handleInput = (e) => {
        e.persist();
        setForgotPassword({...forgotPassword, [e.target.name]: e.target.value})
    }

    const submitForgotPassword = async(e) => {
        e.preventDefault();
        setLoading(true);
        try{
        
            const data = {
                email:forgotPassword.email
            }

            const res = await axios.post(`http://localhost:3000/auth/forgot-password`, data);
            
                if(res.data.status === 200)
                {
                    toast.success(res.data.message, {
                        theme: 'colored',
                    })
                }
                else if(res.data.status === 400)
                {
                    toast.error(res.data.message, {
                        theme: 'colored'
                    })
                }
                else if(res.data.status === 401)
                {
                    toast.error(res.data.message, {
                        theme: 'colored'
                    })
                }
                else if(res.data.status === 500)
                {
                    toast.error(res.data.message, {
                        theme: 'colored'
                    })
                }
        }catch(error){
            console.error("Error createing category: ", error);
            toast.error('Please try again later.', { theme: 'colored' });
        }finally{
            setLoading(false);
        }
        
    }


    return(
        <div>
            <div className="login-wrapper">
                
                <div className="card-parent">

                    <div className="login-card">
                        <HomeLogo />
                        <h3>Forgot your password</h3>
                        <form onSubmit={submitForgotPassword} className="login-form">
                            <div className="uk-form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" name="email" onChange={handleInput} value={forgotPassword.email} placeholder="Enter your email address" className="form-control" required />
                            </div>
                        
                            <div className="forgot-password">
                                <Link to="/login">Back to login</Link>
                            </div>
                            {!loading && (
                                <button type="submit" disabled={loading}>Send Verification Link</button>
                            )}
                            
                             {loading && (
                                <div className="spinner-container">
                                    <div className="spinner"></div>
                                    <h4>Sending Link...</h4>
                                </div>
                             )}
                        </form>
                       
                        
                    </div>

                    <div className="login-img">
                        <div className="image-overlay"></div>
                        <img src={loginImg} alt="login-image" loading="lazy" />

                        <div className="overlay-text">
                            <h2 className="spacing-small">Hello There, Join Us</h2>
                            <p>Enter your personal details and join the cooking community</p>
                            <Link to="/register" className="login-button-primary">Sign Up</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );

}

export default ForgotPassword;
