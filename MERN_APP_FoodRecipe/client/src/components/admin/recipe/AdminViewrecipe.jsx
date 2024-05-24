import axios from "axios";
import React, {useState, useEffect, useRef} from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const AdminViewrecipe = () => {

    const [IsLoading, setIsLoading] = useState(false)

    //fetching all recipe categories
    const [categories, setCategories] = useState([]);

    useEffect(() => {
         getCategories();
    }, []);
 
    const getCategories = async() => {
        try{
            const response = await axios.get(`http://localhost:3000/api/getcategories`);
            if(response.data && response.data.categories){
                setCategories(response.data.categories);
            }else{
                console.error("Unexpected response status", response.data);
            }

        }catch(error){
            console.error("Error fetching category: ", error)
        }
    }


    const { slugs } = useParams();
    //initialized the recipe state as an object with default properties, 
    //including an empty cooking_steps array.
    const [recipe, setRecipe] = useState({  
        name: '',
        slug: '',
        catSlug: '',
        short_des: '',
        status: '',
        active_time: '',
        total_time: '',
        cooking_steps: [],
        ingredients: [],
        meta_title: '',
        meta_keywords: '',
        meta_desc: '',
    });

    //fetching the selected user recipe
    useEffect(() => {
        getAllRecipe();
    }, [slugs]);

    const getAllRecipe = async() => {
        setIsLoading(true);
        try{
            const response = await axios.get(`http://localhost:3000/api/get-admin-recipe/${slugs}`);
            if(response.data && response.data.adminData){
                setRecipe(response.data.adminData)
            }else {
                console.error('Unexpected response structure:', response.data);
            }
        }catch(error) {
            console.error('Error fetching all recipe:', error);
        }finally{
            setIsLoading(false);
        }
    }


   

    

    const handleStepChange = (index, newValue) => {
        const updatedSteps = recipe.cooking_steps.map((step, i) => (i === index ? newValue : step));
        setRecipe({ ...recipe, cooking_steps: updatedSteps });
    };

    const handleIngredentValue = (index, newValue) => {
        const updatedIngredents = recipe.ingredients.map((ingredent, i) => (i === index ? newValue : ingredent));
        setRecipe({ ...recipe, ingredients: updatedIngredents });
    }
    

    const handleInput = (e) => {
        e.persist();
        setRecipe({...recipe, [e.target.name]: e.target.value});
    }

    //Handling image input
    const imageInput = useRef(null);
    const [picture, setPicture] = useState();

    const handleImage = (e) => {
        const file = e.target.files[0]
        setPicture(file);
    }



    const updateRecipe = async(e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', recipe.name);
        formData.append('slug', recipe.slug);
        formData.append('catSlug', recipe.catSlug);
        formData.append('short_des', recipe.short_des);
        formData.append('status', recipe.status);
        formData.append('active_time', recipe.active_time);
        formData.append('total_time', recipe.total_time);
        formData.append('cooking_steps', JSON.stringify(recipe.cooking_steps));
        formData.append('ingredients', JSON.stringify(recipe.ingredients));
        formData.append('meta_title', recipe.meta_title);
        formData.append('meta_keywords', recipe.meta_keywords);
        formData.append('meta_desc', recipe.meta_desc);
        
        if (picture) {
            formData.append('file', picture);
        }

        axios.put(`http://localhost:3000/api/update-user-recipe/${slugs}`, formData).then(res => {
            if (res.data.status === 200) {
                toast.success(res.data.message,{
                    theme: 'colored'
                });
                imageInput.current.value = ''; //clearing image input field
            } else {
                toast.error(res.data.message, {
                    theme: 'colored'
                });
            }
        }).catch(error => {
            console.error("unable to update recipes", error)
        });
    }

    if(IsLoading){
        return(
            <div className="spinner-container">
                <div className="spinner"></div>
                <h4>Loading...</h4>
            </div>
        )
    }

    return(
        <div>
            <div className="admin-main-content">
                <h2>Specific Recipe
                    <Link to="/admin/recipies">
                        <span className="other-h2-span">Go Back</span>
                    </Link>
                </h2>

                <div className="admin-display">

                <div className="user-card">
                        <div className="other-header">
                            <h3>{recipe.name} Recipe</h3>
                        </div>
                        <div className="other-body">
                            {recipe ? 
                                (
                                    <form onSubmit={updateRecipe} encType="multipart/form-data">
                                        <div className="group-12">
                                            <div className="forms-groups">
                                                <label htmlFor="recipe">Recipe Name</label>
                                                <input type="text" name="name" onChange={handleInput} value={recipe.name} placeholder="Enter recipe name" required />
                                            </div>
        
                                            <div className="forms-groups">
                                                <label htmlFor="slug">Slug</label>
                                                <input type="text" name="slug" onChange={handleInput} value={recipe.slug} placeholder="Enter Slug" readOnly />
                                            </div>
        
                                            <div className="forms-groups">
                                                <label htmlFor="categoryId">Category</label>
                                                <select name="catSlug" onChange={handleInput} value={recipe.catSlug}>
                                                    <option value="">Select Category</option>
                                                    {categories.map((category) => (
                                                        <option value={category.slug} key={category._id}>{category.name}</option>
                                                    ))}
                                                </select>
                                            </div>
        
                                            <div className="forms-groups">
                                                <label htmlFor="image" className="file-input-button">Image</label>
                                                <input type="file" name="file" ref={imageInput} onChange={handleImage} />
                                            </div>
                                        </div>
        
                                        <div className="group-12">
                                            <div className="forms-groups">
                                                <label htmlFor="short_desc">Short Description:</label>
                                                <textarea name="short_des" maxLength="1000" onChange={handleInput} value={recipe.short_des} cols="30" rows="10" required></textarea>
                                            </div>
        
                                            <div className="forms-groups">
                                                <label htmlFor="status">Status:</label>
                                                <select name="status" onChange={handleInput} value={recipe.status}>
                                                    <option value="1">Show</option>
                                                    <option value="0">Hidden</option>
                                                </select>
                                            </div>
        
                                            <div className="forms-groups">
                                                <label htmlFor="active time">Active Time</label>
                                                <input type="text" name="active_time" onChange={handleInput} value={recipe.active_time} required placeholder="Exp. 20mins. Enter only digits" />
                                            </div>
        
                                            <div className="forms-groups">
                                                <label htmlFor="total time">Total Time</label>
                                                <input type="text" name="total_time" onChange={handleInput} value={recipe.total_time} required placeholder="Total time preparing the food. Enter only digits" />
                                            </div>
                                        </div>
        
                                        <hr />
                                        <h2>Cooking Steps</h2>
        
                                        <div className="group-12">
                                            {recipe.cooking_steps.map((step, index) => (
                                                <div key={index} className="forms-groups">
                                                    <label htmlFor={`step-${index}`}>Step {index + 1}</label>
                                                    <textarea
                                                        id={`step-${index}`}
                                                        name="cooking_steps"
                                                        cols="30"
                                                        rows="7"
                                                        placeholder="Enter the steps for the meal preparations"
                                                        value={step}
                                                        onChange={(e) => handleStepChange(index, e.target.value)}
                                                        required
                                                    ></textarea>
                                                </div>
                                            ))}
                                        </div>
        
                                        <hr />
                                        <h2>Cooking Ingredients</h2>
                                        
                                        <div className="group-12">
                                            {recipe.ingredients.map((ingredent, index) => (
                                                <div key={index} className="forms-groups">
                                                    <label htmlFor={`ingredent ${index}`}>Ingredient {index + 1}</label>
                                                    <input
                                                        type="text"
                                                        id={`ingredent-${index}`}
                                                        name="ingredients"
                                                        placeholder="Enter Ingredient for meal preparation"
                                                        value={ingredent}
                                                        onChange={(e) => handleIngredentValue(index, e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            ))}
                                        </div>
        
                                        <hr />
                                        <h2>SEO Meta Tags</h2>
        
                                        <div className="group-12">
                                            <div className="forms-groups">
                                                <label htmlFor="category-name">Meta Title</label>
                                                <input type="text" name="meta_title" onChange={handleInput} value={recipe.meta_title} placeholder="Enter category name" />
                                            </div>
        
                                            <div className="forms-groups">
                                                <label htmlFor="category-name">Meta Keywords:</label>
                                                <textarea name="meta_keywords" onChange={handleInput} value={recipe.meta_keywords} cols="30" rows="10"></textarea>
                                            </div>
                                        </div>
        
                                        <div className="forms-groups">
                                            <label htmlFor="category-name">Meta Description:</label>
                                            <textarea name="meta_desc" onChange={handleInput} value={recipe.meta_desc} cols="30" rows="10"></textarea>
                                        </div>
        
                                        <div className="group-6">
                                            <button type="submit">Update Recipe</button>
                                        </div>
                                    </form>
                                ) : ( 
                                        <p>
                                            <div className="spinner-container">
                                                <div className="spinner"></div>
                                                <h4>Loading...</h4>
                                            </div>
                                        </p>
                                    )
                            }
                        </div>
                    </div>

                </div>

            </div>
            

        </div>


    );

}

export default AdminViewrecipe;
