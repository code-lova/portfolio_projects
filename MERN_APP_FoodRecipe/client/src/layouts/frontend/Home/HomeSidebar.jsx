import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const HomeSidebar = () => {
    const [categories, setCategories] = useState([]);


    useEffect(() => {
        fetchCategories();
    },[]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/getcategories`);
            // console.log("API response", response)

            setCategories(response.data.categories);

        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };


    return(
       
        <div>
             <h1>Recipes</h1>
            <ul className="sidebarlist">
                {categories.map((cat) => (
                    <li key={cat._id}>
                        <Link to={`/recipe-categories/${cat.slug}`}>{cat.name} </Link>
                    </li>
                ))}
            </ul>
        </div>
        


    );

}

export default HomeSidebar;
