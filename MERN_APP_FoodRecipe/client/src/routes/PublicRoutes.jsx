import React, {useState, useEffect} from "react";
import "../small.css";
import "../large.css";
import { Navigate } from 'react-router-dom';
import axios from "axios";



const PublicRoutes = ({ component: Component, ...rest }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get('http://localhost:3000/auth/checkloginstatus'); // Adjust the endpoint as needed
                if (response.data.status === 200) {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                // Handle error (e.g., token expired or invalid)
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    if (isLoading) {
        return (
            <div>
                <h3> Loading...</h3>  
            </div>
        );
    }

    return isLoggedIn ? <Navigate to="/" replace /> : <Component {...rest} />;

}

export default PublicRoutes;
