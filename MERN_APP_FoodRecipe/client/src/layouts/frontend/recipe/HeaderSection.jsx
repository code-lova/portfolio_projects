import React, {useState, useEffect, useRef} from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import commentImg from "../../../assets/images/comment-img.webp";
import { toast } from "react-toastify";
import SocialShare from "../../frontend/common/SocialShare"


const HeaderSection = () => {

    const { slug } = useParams();

    const [recipe, setRecipe] = useState([]);

    const [recipeCount, setRecipeCount] = useState(0);

    const [loading, setLoading] = useState(true);

    const [btnLoading, setBtnLoading] = useState(false);

    const starInputRefs = useRef([]);

    const [comment, setComment] = useState({
        fullname: '',
        rating: '',
        comment: '',
        recipeId: recipe._id,
        recipeSlug: recipe.slug,
        catSlug: recipe.catSlug,
        chefId: recipe.userId

    });

    const [displayCommets, setDisplayCommets] = useState([]);

    //====FETCHED THE SELECTED RECIPE AND DISPLAY ON PAGE====\\
    useEffect(() => {
        getRecipe();
    }, [slug]);

    const getRecipe = async() => {
        try{
            const response = await axios.get(`http://localhost:3000/api/get-recipe/${slug}`);
            // console.log("API Resonse:", response.data)
            if(response.data && response.data.recipeData){
                setRecipe(response.data.recipeData);
                setRecipeCount(response.data.chefRecipeCount);
                setLoading(false);
            }else{
                console.error("Unexpected response structure", response.data);
            }

        }catch(error){
            console.error("error fetching recipe", error)
        } 
    };


    useEffect(() => {
        if(recipe){
            setComment({...comment, recipeId: recipe._id, recipeSlug: recipe.slug});
            getComments();
        }
    },[recipe]);



    //====FUNCTION TO CREATE NEW COMMENT SECTION OF THE PAGE====\\
    const handleInput = (e) => {
        e.persist();
        setComment({...comment, [e.target.name]: e.target.value});
    }

    const resetInputs = () => {
        setComment({...comment, 
            fullname: '',
            rating: '',
            comment: '',
            recipeId: recipe._id,
            recipeSlug: recipe.slug,
            catSlug: recipe.catSlug,
            chefId: recipe.userId
        })
    }


    const submitComment = async(e) => {
        e.preventDefault();
        setBtnLoading(true);

        const data = {
            fullname: comment.fullname,
            rating: comment.rating,
            comment: comment.comment,
            recipeId: recipe._id,
            recipeSlug: recipe.slug,
            catSlug: recipe.catSlug,
            chefId: recipe.userId
        }
        try{

            const response = await axios.post(`http://localhost:3000/api/store-comment`, data);

            //we are getting the comment back as we store it in an object (commentData),
            // so we can match it with the state of setDisplayComment() below, when fetching the recipe comment.
            const {status, message, commentData } = response.data;

            switch (status) {
                case 200:
                    toast.success(message, {
                        theme: 'colored'
                    });
                    resetInputs();
                    // Clear the star rating
                    starInputRefs.current.forEach((input) => {
                        input.checked = false;
                    });
                    // Update the state to include the new comment
                    setDisplayCommets([...displayCommets, commentData]);
                    break;
                case 422:
                    toast.warning(message, {
                        theme: 'colored'
                    });
                    break;
                case 500:
                    toast.error(message, {
                        theme: 'colored'
                    });
                    break;
                default:
                    console.log("Unexpected response status:", status);
            }

        }catch(error){
            console.error("Error posting comment: ", error);
            toast.error('Please try again later.', { theme: 'colored' });
        }
        setBtnLoading(false); // Set Btnloading to false after form submission
    }


    //====DISPLAY COMMENT BOX OF THE USER====\\
    const getComments = async() => {
        try{
            const response = await axios.get(`http://localhost:3000/api/show-comments/${slug}`);
            if(response.data && response.data.commentData){
                setDisplayCommets(response.data.commentData);
            }else{
                console.error("Unexpected response structure", response.data);
            }

        }catch(error){
            console.error("Unable to fetch comments")
        }
    }


    const saveRecipeToLocalStorage = () => {
        const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
        const isAlreadySaved = savedRecipes.some((savedRecipe) => savedRecipe._id === recipe._id);
    
        if (isAlreadySaved) {
            toast.warning("Recipe Already Saved",{
                theme: 'colored'
            });
        } else {
            savedRecipes.push(recipe);
            localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
            toast.success("Recipe Saved Successfully",{
                theme: 'colored'
            })
        }
    };


    

    let Commetn_HTML_Template = "";

    if(displayCommets.length === 0){
        Commetn_HTML_Template = <div>
            
            <p>Be the first to post a comment...🍱😊</p>
            
        </div>
    }else{
        Commetn_HTML_Template = <div>
            {displayCommets.map((comments) => {

                //Function to format the time and date
                function timeAgo(dateString) {
                    const date = new Date(dateString);
                    const now = new Date();
                    const diffTime = now - date;

                    const seconds = Math.floor(diffTime / 1000);
                    const minutes = Math.floor(seconds / 60);
                    const hours = Math.floor(minutes / 60);
                    const days = Math.floor(hours / 24);

                    if (seconds < 60) {
                        return `${seconds} sec ago`;
                    } else if (minutes < 60) {
                        return `${minutes} mins ago`;
                    } else if (hours < 24) {
                        return `${hours} hrs ago`;
                    } else {
                        return `${days} days ago`;
                    }
                }
                const formattedDate = timeAgo(comments.createdAt);
            
                return(
                    <div key={comments._id} className="comment-box-header">
                        <div className="comment-box">
                            <div className="comment-image-box">
                                <img src={commentImg} alt="guest-image" />
                            </div>
                            <div className="comment-name">
                                <h3>{comments.fullname}</h3>
                                <h5>{formattedDate}</h5>

                                 {[...Array(comments.rating)].map((star, index) => (
                                    <span key={index} className="rating">&#9733;</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p>{comments.comment}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    }



    
    if(loading){
        return(
            <div className="recipe-grid">
                <div className="spinner-container">
                    <div className="spinner"></div>
                    <h4>Loading...</h4>
                </div>
            </div>
        )
    }

    return(
        <>
            <div className="recipe-head-section">

                <div className="recipe-image">
                    {/* <img src={recipeImg} alt="recipe-image" loading="lazy"/> */}
                    <img src={`http://localhost:3000/uploads/${recipe.file}`} alt={recipe.name} loading='lazy' width={50}  height={190}/>

                </div>

                <div className="recipe-head-details">

                    <div className="recipe-title">
                        <h2>{recipe.name}</h2>
                    </div>

                    <p className="recipe-head-details-p">
                        {recipe.short_des}
                    </p>

                    <div className="recipe-time">

                        <div className="time">
                            <svg width="28" height="28" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-svg="clock">
                                <circle fill="none" stroke="#000" strokeWidth="1.1" cx="10" cy="10" r="9"></circle>
                                <rect x="9" y="4" width="1" height="7"></rect>
                                <path fill="none" stroke="#000" strokeWidth="1.1" d="M13.018,14.197 L9.445,10.625"></path>
                            </svg>
                            <h4>Active Time</h4>
                            <p>{recipe.active_time}mins</p>
                        </div>

                        <div className="time-seperator"></div>

                        <div className="time">
                            <svg width="28" height="28" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-svg="future">
                                <polyline points="19 2 18 2 18 6 14 6 14 7 19 7 19 2"></polyline>
                                <path fill="none" stroke="#000" strokeWidth="1.1" d="M18,6.548 C16.709,3.29 13.354,1 9.6,1 C4.6,1 0.6,5 0.6,10 C0.6,15 4.6,19 9.6,19 C14.6,19 18.6,15 18.6,10"></path>
                                <rect x="9" y="4" width="1" height="7"></rect>
                                <path d="M13.018,14.197 L9.445,10.625" fill="none" stroke="#000" strokeWidth="1.1"></path>
                            </svg>
                            <h4>Total Time</h4>
                            <p>{recipe.total_time} Mins</p>
                        </div>
                    </div>

                    <div className="cheif-info">
                        <div className="left">
                            <h5>Created by Chef {recipe.userId.name}</h5>
                            <p>{recipeCount} Recipes</p>
                        </div>
                        <div className="right">
                            <Link to=""><button onClick={() => saveRecipeToLocalStorage(recipe) }><i className="fas fa-save"></i> Save Recipe</button></Link>
                                
                            <a href={`mailto:${recipe.userId.email}`} target="_blank" rel="noopener noreferrer">
                                <button><i className="fas fa-envelope"></i> Contact Chef</button>
                            </a>               
                        </div>
                    </div>
                </div>
            </div>

            <div className="recipe-main-section">

                <div className="how-to-make">
                    <h2>Cooking Steps</h2>
                    {recipe.cooking_steps.map((steps, index) => {
                        return(
                            <div key={index}>
                                <h3>STEP {index + 1}</h3>
                                <p>{steps}</p>
                            </div>
                        )
                    })}
                    <div className="recpipe-divider-line"></div>

                    <div>
                        <div className="comment-section">
                            <h2>Comments</h2>

                            {Commetn_HTML_Template}
                           

                            <div className="comment-star-form">
                                <form onSubmit={submitComment}>
                                    <div className="star-rating">
                                        <p>Rate this Recipe</p>
                                        {[5, 4, 3, 2, 1].map((star, index) => (
                                            <React.Fragment key={star}>
                                                <input
                                                    type="radio"
                                                    id={`star${star}`}
                                                    ref={(el) => (starInputRefs.current[index] = el)}
                                                    onChange={handleInput}
                                                    name="rating"
                                                    value={star}
                                                    checked={comment.rating === `${star}`}
                                                />
                                                <label htmlFor={`star${star}`}></label>
                                            </React.Fragment>
                                        ))}
                                    </div>

                                    <input type="hidden" name="recipeId" value={recipe._id} />
                                    <input type="hidden" name="recipeSlug" value={recipe.slug} />
                                    <input type="hidden" name="catSlug" value={recipe.catSlug} />
                                    <input type="hidden" name="chefId" value={recipe.userId} />

                                    <label htmlFor="full-name"></label>
                                    <input type="text" name="fullname" onChange={handleInput} value={comment.fullname} className="form-controls" placeholder="Enter full name"/>

                                    <label htmlFor="full-name"></label>
                                    <textarea name="comment" onChange={handleInput} value={comment.comment} className="form-controls" cols="30" rows="10" placeholder="Enter your comment"></textarea>

                                    <div>
                                        <button type="submit" disabled={btnLoading} className="btn-primary">{ btnLoading ? 'Posting Comment...' : 'Post Comment'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>



                <div className="ingredent">
                    <h2>Ingredents</h2>
                    {recipe.ingredients.map((ingre, index) => {
                        return(
                            <div key={index}>
                                <p>{ingre}</p>
                            </div>
                        )
                    })}
                    <div className="recipe-social-share">
                        <h3>Share your Recipe</h3>
                        <SocialShare /> 
                    </div>
                </div>
            </div>
        </>
    );

}

export default HeaderSection;
