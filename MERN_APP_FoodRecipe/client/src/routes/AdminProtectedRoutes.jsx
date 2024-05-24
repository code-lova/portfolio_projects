import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../layouts/admin/AminLayout";

const AdminProtectedRoutes = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:3000/auth/verifyadmin").then(res => {
            if(res.data.status === 200){

                setLoading(false)
            }
            else if(res.data.status === 401)
            {
                navigate('/login');
            }
        });

    },[]);

    if (loading) {
        return (
            <div>
                <h3> Loading...</h3>  
            </div>
        );
    }

    return(
        <div>
            {<AdminLayout />}

        </div>


    );

}

export default AdminProtectedRoutes;
