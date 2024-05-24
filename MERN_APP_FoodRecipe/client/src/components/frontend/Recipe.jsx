import React from "react";
import HeaderSection from "../../layouts/frontend/recipe/HeaderSection";
import HomeRecipe from "../../layouts/frontend/Home/HomeRecipe";

const Recipe = () => {

    return(
        <div>
            <div className="recipe-page">
                <HeaderSection />
               
                <div className="other-recipies">
                    <h3>Other Recipes you may like</h3>
                    <HomeRecipe />
                </div>
            </div>
            
        </div>

    );

}

export default Recipe;
