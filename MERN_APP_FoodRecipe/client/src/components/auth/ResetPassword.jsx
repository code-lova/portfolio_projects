import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";
import { toast } from "react-toastify";
import loginImg from "../../assets/images/photo-1556911220-e15b29be8c8f0e89.jpg";
import HomeLogo from "../../layouts/frontend/Home/HomeLogo";

const ResetPassword = () => {

    const navigate = useNavigate()

    const [passwordResetInput, setPasswordResetInput] = useState({
        password: '',
        cpassword: '',
    });

    const {token} = useParams();

    const handleInput = (e) => {
        e.persist();
        setPasswordResetInput({...passwordResetInput, [e.target.name]: e.target.value});
    }

    const submitResetPassword = async(e) => {
        e.preventDefault();

        try{

            const data = {
                password:passwordResetInput.password,
                cpassword:passwordResetInput.cpassword,
            }

            const response = await axios.post(`http://localhost:3000/auth/reset-password/${token}`, data)

            const {status, message} = response.data;

            switch (status) {
                case 200:
                    toast.success(message, {
                        theme: 'colored'
                    })
                    navigate('/login');
                    break;
                case 404:
                case 400:
                    toast.warning(message, {
                        theme: 'colored'
                    });
                    break;
                case 500:
                    toast.error(message, {
                        theme: 'colored'
                    })
                    navigate('/forgot-password');
                default:
                    console.error("Unexpected error status: ", status)


            }

        }catch(error){
            console.error('Error occurred during resetting password:', error);
            toast.error('Please try again later.', { theme: 'colored' });
        }

    }

    return(
        <div>
             <div className="login-wrapper">
                
                <div className="card-parent">

                    <div className="login-card">
                        <HomeLogo />
                        <h3>Password Reset</h3>
                        <form onSubmit={submitResetPassword} className="login-form">
                          
                            <div className="uk-form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" name="password" onChange={handleInput} value={passwordResetInput.password} placeholder="Min 8 characters ****" className="form-control" required />
                            </div>

                            <div className="uk-form-group">
                                <label htmlFor="cpassword">Confirm Password</label>
                                <input type="password" name="cpassword" onChange={handleInput} value={passwordResetInput.cpassword} placeholder="Min 8 characters ****" className="form-control" required />
                            </div>
                        
                            <button type="submit">Reset your Password</button>
                        </form>
                        
                    </div>

                    <div className="login-img">
                        <div className="image-overlay"></div>
                        <img src={loginImg} alt="login-image" loading="lazy" />

                        <div className="overlay-text">
                            <h2 className="spacing-small">Almost there</h2>
                            <p>Reset your password to gain access to you account.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>


    );

}

export default ResetPassword;
