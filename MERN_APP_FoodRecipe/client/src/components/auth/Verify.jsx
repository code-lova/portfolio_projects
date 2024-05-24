import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import loginImg from "../../assets/images/photo-1556909114-89e7f2bcbf97e3a5.jpg";
import HomeLogo from "../../layouts/frontend/Home/HomeLogo";
import {toast} from "react-toastify";
import axios from "axios"

const Verify = () => {

    const navigate = useNavigate();
    const [otpInput, setOtpInput] = useState({
        otp: '',
    });

    const handleInput = (e) => {
        e.persist();
        setOtpInput({...otpInput, [e.target.name]: e.target.value});
    }

    const submitOTP = (e) => {
        e.preventDefault();

        const data = {
            otp: otpInput.otp
        }

        axios.post(`http://localhost:3000/auth/verify-email`, data).then(res => {
            if(res.data.status === 200){
                toast.success(res.data.message, {
                    theme: 'colored',
                });
                navigate('/login');

            }else if(res.data.status === 404){
                toast.warning(res.data.message, {
                    theme: 'colored',
                });
            }
            else if(res.data.status === 400){
                toast.error(res.data.message, {
                    theme: 'colored',
                });
            }
        })

    }


    return(
        <div>
            <div className="login-wrapper">
                
                <div className="card-parent">

                    <div className="login-card">
                        <HomeLogo />
                        <h3>Enter The OTP verificaton Code</h3>
                        <form onSubmit={submitOTP} className="login-form">

                            <div className="uk-form-group">
                                <label htmlFor="email">OTP Code</label>
                                <input type="text" name="otp" onChange={handleInput} value={otpInput.name} placeholder="Enter otp" className="form-control" />
                            </div>

                            <div className="forgot-password">
                                <p>By signing up you agree to our <Link to="#" className="terms">terms</Link> of services</p>
                            </div>
                            <button type="submit">Verify Account</button>
                        </form>
                        
                    </div>

                    <div className="login-img">
                        <div className="image-overlay"></div>
                        <img src={loginImg} alt="login-image" loading="lazy" />

                        <div className="overlay-text">
                            <h2 className="spacing-small">Almost There</h2>
                            <p>Just one more step remaining..</p>
                            {/* <Link to="/login" className="login-button-primary">Login</Link> */}
                        </div>
                        
                      
                    </div>

                </div>
            </div>

        </div>


    );

}

export default Verify;
