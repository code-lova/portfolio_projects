import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";


const SavedRecipe = () => {

    const [savedRecipes, setSavedRecipes] = useState([]);

    useEffect(() => {
        // Fetch saved recipes from local storage when the component mounts
        const savedRecipeData = JSON.parse(localStorage.getItem("savedRecipes")) || [];
        setSavedRecipes(savedRecipeData);
    },[])
    

    return(
        <div className="recipe-search">
            <h2>Saved Recipes</h2>

            <div className="recipe-grid">
                {savedRecipes.map((data, index) => {
                    return(
                        <Link to={`/recipe/${data.slug}`} key={index}>
                            <div className="recipes-card">
                                <img src={`http://localhost:3000/uploads/${data.file}`} alt={data.name} loading='lazy' width={50}  height={190}/>
                                <h3>{data.name}</h3>
                            </div>     
                            <div className="recipe-details-flexible">
                                
                                <div className="details">
                                    <span className="rating">&#9733;</span>
                                    <span className="xsmall-left">{data.ratings} </span>
                                    <span>({data.comment_count} Comments)</span>
                                </div>
        
                                <div className="details">
                                    <h4>{data.userId.name}</h4>
                                </div>
        
                            </div>          
                        </Link>

                    )

                })}
               

               


            </div>

        </div>
    );

}

export default SavedRecipe;
