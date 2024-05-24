import axios from "axios";
import React, {useState, useRef, useEffect} from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const AddRecipe = () => {


    //fetching all recipe categories
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = async() => {
        try{
            const response = await axios.get(`http://localhost:3000/api/get-categories`);
            if(response.data && response.data.catData){
                setCategories(response.data.catData);
            }else {
                console.error('Unexpected response structure:', response.data);
            }

        }catch(error){
            console.error("Error fetching category: ", error)
        }
    }


    //FUNCTIONS TO ADD STEPS
    const [textAreas, setTextAreas] = useState([{ id: 1, value: '' }]);

    const addTextArea = () => {
        if (textAreas.length < 5) {
            setTextAreas([...textAreas, { id: textAreas.length + 1, value: '' }]);
        }
    };

    const removeTextArea = (id) => {
        setTextAreas(textAreas.filter(area => area.id !== id));
    };

    const handleChange = (id, value) => {
        setTextAreas(textAreas.map(area => area.id === id ? { ...area, value } : area));
    };

    const resetTextAreas = () => {
        setTextAreas([{ id: 1, value: '' }]);
    };

    //FUNCTION TO ADD INGREDENTS
    const [ingredents, setIngredents] = useState([{ id: 1, value: '' }]);

    const addIngredents = () => {
        if (ingredents.length < 10) {
            setIngredents([...ingredents, { id: ingredents.length + 1, value: '' }]);
        }
    };

    const removeIngredents = (id) => {
        setIngredents(ingredents.filter(ingre => ingre.id !== id));
    };

    const handleValue = (id, value) => {
        setIngredents(ingredents.map(ingre => ingre.id === id ? { ...ingre, value } : ingre));
    };

    const resetIngredents = () => {
        setIngredents([{ id: 1, value: '' }]);
    };


    const [recipe, setRecipe] = useState({
        name: '',
        slug: '',
        catSlug: '',
        short_des: '',
        status: 1,
        active_time: '',
        total_time: '',
        cooking_steps: '',
        ingredients: '',
        meta_title: '',
        meta_keywords: '',
        meta_desc: ''
    });



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

    const resetInputFields = () => {
        setRecipe({...recipe,
            name: '',
            slug: '',
            catSlug: '',
            short_des: '',
            status: 1,
            active_time: '',
            total_time: '',
            cooking_steps: '',
            ingredients: '',
            meta_title: '',
            meta_keywords: '',
            meta_desc: ''
        });
    }


   

    const createRecipe = (e) => {
        e.preventDefault();

        try{

            const formData = new FormData();
            formData.append('file', picture);
            formData.append('name', recipe.name);
            formData.append('slug', recipe.slug);
            formData.append('catSlug', recipe.catSlug);
            formData.append('short_des', recipe.short_des);
            formData.append('status', recipe.status);
            formData.append('active_time', recipe.active_time);
            formData.append('total_time', recipe.total_time);
            formData.append('meta_title', recipe.meta_title);
            formData.append('meta_keywords', recipe.meta_keywords);
            formData.append('meta_desc', recipe.meta_desc);

            // Add cooking steps
            textAreas.forEach((area, index) => {
                formData.append(`cooking_steps[${index}]`, area.value);
            });

             // Add cooking ingredients
            ingredents.forEach((ingre, index) => {
                formData.append(`ingredients[${index}]`, ingre.value);
            });

            axios.post('http://localhost:3000/api/storerecipes', formData).then(res => {
                if (res.data.status === 200) {
                    toast.success(res.data.message,{
                        theme: 'colored'
                    });
                    resetInputFields();
                    imageInput.current.value = ''; //clearing image input field
                    resetTextAreas();
                    resetIngredents();
                } else {
                    toast.error(res.data.message, {
                        theme: 'colored'
                    });
                }
            });


        }catch (error) {
            console.error('Error creating recipe:', error);
            toast.error('Error please try again later.');
        }

    }

    

    


    return(
        <div>
            <div className="main-content">
                <h2>New Recipe
                    <Link to="/user/recipies">
                        <span className="other-h2-span">Go Back</span>
                    </Link>
                </h2>

                <div className="other-large-display">
                    <div className="user-card">
                        <div className="other-header">
                            <h3>Create New Recipe</h3>
                        </div>
                        <div className="other-body">
                            <form onSubmit={createRecipe} encType="multipart/form-data">
                                <div className="group-12">
                                    <div className="forms-groups">
                                        <label htmlFor="recipe">Recipe Name</label>
                                        <input type="text" name="name" onChange={handleInput} value={recipe.name} placeholder="Enter recipe name" required/>
                                    </div>

                                    <div className="forms-groups">
                                        <label htmlFor="slug">Slug</label>
                                        <input type="text" name="slug" onChange={handleInput} value={recipe.slug} placeholder="Enter Slug" required/>
                                    </div>

                                    <div className="forms-groups">
                                        <label htmlFor="categoryId">Category</label>
                                        <select name="catSlug" onChange={handleInput} value={recipe.catSlug}>
                                            <option value="">Select Category</option>
                                            {
                                                categories.map((cat) => {
                                                    return(
                                                        <option value={cat.slug} key={cat._id}>{cat.name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>

                                    <div className="forms-groups">
                                        <label htmlFor="image" className="file-input-button">Image</label>
                                        <input type="file" name="file" ref={imageInput} onChange={handleImage} required/>
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
                                        <input type="text" name="active_time" onChange={handleInput} value={recipe.active_time} required placeholder="Exp. 20mims. Enter only digits" />
                                    </div>

                                    <div className="forms-groups">
                                        <label htmlFor="total time">Total Time</label>
                                        <input type="text" name="total_time" onChange={handleInput} value={recipe.total_time} required placeholder="Total time preparing the food. Enter only digits" />
                                    </div>

                                </div>

                                <hr />
                                <h2>Cooking Steps</h2>

                                <div className="forms-groups">
                                    <button className="dynamic-btn" type="button" onClick={addTextArea}>Add More Steps</button>
                                </div>

                                <div className="group-12">
                                    {textAreas.map(textArea => (
                                        <div key={textArea.id} className="forms-groups">
                                            <label htmlFor={`step-${textArea.id}`}>Step {textArea.id}</label>
                                            <textarea
                                                id={`step-${textArea.id}`}
                                                name="cooking_steps"
                                                cols="30"
                                                rows="7"
                                                placeholder="Enter the steps for the meal preparations"
                                                value={textArea.value}
                                                onChange={(e) => handleChange(textArea.id, e.target.value)}
                                                required
                                            ></textarea>
                                            {textAreas.length > 1 && (
                                                <button className="dynamic-btn-remove" type="button" onClick={() => removeTextArea(textArea.id)}>Remove</button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <hr />
                                <h2>Cooking Ingredents</h2>
                                <div className="forms-groups">
                                    <button className="dynamic-btn" type="button" onClick={addIngredents}>Add More Ingredents</button>
                                </div>
                                <div className="group-12">
                                    {ingredents.map(ingredent => (
                                        <div key={ingredent.id} className="forms-groups">
                                            <label htmlFor={`ingredent ${ingredent.id}`}>Ingredent {ingredent.id}</label>
                                            <input 
                                                type="text"
                                                id={`ingredent-${ingredent.id}`}  
                                                name="ingredients" 
                                                placeholder="Enter Ingredent for meal preparation"
                                                value={ingredent.value} 
                                                onChange={(e) => handleValue(ingredent.id, e.target.value)}
                                            />
                                            {ingredents.length > 1 && (
                                                <button type="button" className="dynamic-btn-remove" onClick={() => removeIngredents(ingredent.id)}>Remove</button>
                                            )}
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
                                    <button type="submit">Create Recipe</button>
                                </div>
                            </form>

                        </div>
                    </div>




                </div>
            </div>


        </div>


    );

}

export default AddRecipe;
