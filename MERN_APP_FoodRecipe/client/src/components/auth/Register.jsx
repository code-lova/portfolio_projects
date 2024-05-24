import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginImg from "../../assets/images/photo-1556909114-89e7f2bcbf97e3a5.jpg";
import HomeLogo from "../../layouts/frontend/Home/HomeLogo";
import {toast} from "react-toastify";
import axios from "axios"



const Register = () => {

    const navigate = useNavigate();

    const [regInput, setRegInput] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        cpassword: '',
    });

    const handleInput = (e) => {
        e.persist();
        setRegInput({...regInput, [e.target.name]: e.target.value});
    }

    const submitRegister = async (e) => {
        e.preventDefault();
        
        try{

            const data = {
                name: regInput.name,
                username: regInput.username,
                email: regInput.email,
                password: regInput.password,
                cpassword: regInput.cpassword,
            }

            const response = await axios.post(`http://localhost:3000/auth/register`, data);

            const {status, message} = response.data;

            switch(status){
                case 200:
                    toast.success(message, {
                        theme: "colored"
                    })
                    navigate('/verify');
                    break;
                case 400:
                    toast.warning(message, {
                        theme: 'colored'
                    })
                    break;
                case 409:
                case 500:
                    toast.error(message, {
                        theme: "colored"
                    })
                    break;
                default:
                    console.error('Unexpected response status:', status);
            }

        }catch (error) {
            console.error('Error occurred during sign-up:', error);
            toast.error('Please try again later.', { theme: 'colored' });
        }
    }


    return(
        <div>
            <div className="login-wrapper">
                
                <div className="card-parent">

                    <div className="login-card">
                        <HomeLogo />
                        <h3>Create a Chef Account with ChefChi</h3>
                        <form onSubmit={submitRegister} className="login-form">

                            <div className="uk-form-group">
                                <label htmlFor="email">Full Name</label>
                                <input type="text" name="name" onChange={handleInput} value={regInput.name} placeholder="Enter your full name"  required />
                            </div>


                            <div className="uk-form-group">
                                <label htmlFor="email">UserName</label>
                                <input type="text" name="username" onChange={handleInput} value={regInput.username} placeholder="Enter a username" required />
                            </div>

                            <div className="uk-form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" name="email" onChange={handleInput} value={regInput.email} placeholder="Enter your email address" required />
                            </div>

                            <div className="uk-form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" name="password" onChange={handleInput} value={regInput.password} placeholder="Min 6 characters ****" required />
                            </div>

                            <div className="uk-form-group">
                                <label htmlFor="cpassword">Confirm Password</label>
                                <input type="password" name="cpassword" onChange={handleInput} value={regInput.cpassword} placeholder="Min 6 characters ****" required />
                            </div>
                        
                            <div className="forgot-password">
                                <p>By signing up you agree to our <Link to="#" className="terms">terms</Link> of services</p>
                            </div>
                            <button type="submit">Create your Account</button>
                        </form>
                        
                    </div>

                    <div className="login-img">
                        <div className="image-overlay"></div>
                        <img src={loginImg} alt="login-image" loading="lazy" />

                        <div className="overlay-text">
                            <h2 className="spacing-small">Welcome Back</h2>
                            <p>Already signed up, enter your details and start cooking your first meal today</p>
                            <Link to="/login" className="login-button-primary">Login</Link>
                        </div>
                        
                      
                    </div>

                </div>
            </div>
        </div>



    );

}

export default Register;
