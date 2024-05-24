import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import loginImg from "../../assets/images/photo-1556911220-e15b29be8c8f0e89.jpg";
import HomeLogo from "../../layouts/frontend/Home/HomeLogo";
import axios from "axios";
import {toast} from "react-toastify";


const Login = () => {

    const navigate = useNavigate();
    const [loginInput, setLoginInput] = useState({

        username: '',
        password: '',

    });

    const handleInput = (e) => {
        e.persist();
        setLoginInput({...loginInput, [e.target.name]: e.target.value});
    }

    const SubmitLogin = async (e) => {
        e.preventDefault();

        try{

            const data = {
                username:loginInput.username,
                password:loginInput.password,
            };

            const response = await axios.post(`http://localhost:3000/auth/login`, data);

            const {status, message} = response.data;

            switch (status) {
                case 200:
                    toast.success(message, {
                        theme: 'colored'
                    });
                    if(response.data.role === 1)
                    {
                        navigate('/admin/dashboard');
                    
                    }else
                    {
                        navigate('/user/dashboard');
                    }
                    break;
                case 400:
                case 401:
                case 500:
                    toast.error(message, {
                        theme: 'colored'
                    });
                    break;
                default:
                    console.error('Unexpected response status:', status);
            }

        }catch(error){
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
                        <h3>Sign in to ChefChi</h3>
                        <form onSubmit={SubmitLogin} className="login-form">
                            <div className="uk-form-group">
                                <label htmlFor="Username">Username</label>
                                <input type="text" name="username" onChange={handleInput} value={loginInput.username} placeholder="Enter your username" className="form-control" required />
                            </div>

                            <div className="uk-form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" name="password" onChange={handleInput} value={loginInput.password} placeholder="Min 8 characters ****" className="form-control" required />
                            </div>
                        
                            <div className="forgot-password">
                                <Link to="/forgot-password">Forgot your password?</Link>
                            </div>
                            <button type="submit">Login your Account</button>
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

export default Login;
