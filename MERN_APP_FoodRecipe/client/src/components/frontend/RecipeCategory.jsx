import React, {useState, useEffect} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {toast} from "react-toastify";


const RecipeCategory = () => {

    const navigate = useNavigate();
    const {slug} = useParams();

    const [selectedCategory, setSelectedCategory] = useState([]);

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);

    const [sortOption, setSortOption] = useState("latest");

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


    useEffect(() => {

        if(slug){
            fetchedSelectedCategory();
        }
     
    }, [slug, sortOption])


    const fetchedSelectedCategory = async() => {
        try{

            const response = await axios.get(`http://localhost:3000/api/sort-recipe-category/${slug}?sort=${sortOption}`);
            // console.log("API response: ", response.data)
            if(response.data && response.data.sortedData){
                setSelectedCategory(response.data.sortedData);
            }else{
                console.error("Unexpected response structure: ", response.data)
            }

        }catch(error){
            console.error("Error fetching category recipies:", error)
        }finally {
            setLoading(false);
        }
    }






    const getRecipesCategory = async(e, slug) => {
        e.preventDefault();
        navigate(`/recipe-categories/${slug}`);
    }

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    }


    let selectedCategort_HTML_TEMPLATE = "";

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

    if(!selectedCategory || selectedCategory.length === 0){

        selectedCategort_HTML_TEMPLATE = <div>

            <h3>There are no recipies for this category</h3>

        </div>

    }else{

        selectedCategort_HTML_TEMPLATE = <div className="recipe-grid">
            {selectedCategory.map((data) => {
                return(
                    <div key={data._id}>
                        <Link to={`/recipe/${data.slug}`}>
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
                                    <h4>By {data.userId.name}</h4>
                                </div>
                            </div>          
                        </Link>
                    </div>
                )

            })}

        </div>

       

    }


    return(
        <div className="recipe-search">
            <h2>Sort by Category</h2>

            <div className="large-section">

                <div className="card1">

                    <div className="left">
                        <ul className="sidebarlist">
                            {categories.map((cat) => (
                                <li key={cat._id}>
                                    <Link onClick={(e) => (getRecipesCategory(e, cat.slug))}>{cat.name} </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>


                <div className="card2">
                    <select name="sort" id="sort" className="filter" onChange={handleSortChange}>
                        <option value="latest">Sort by: latest</option>
                        <option value="top-rated">Sort by: top rated</option>
                        <option value="trending">Sort by: trending</option>
                    </select>
                </div>
            </div>
                
            {selectedCategort_HTML_TEMPLATE}

        </div>




    );

}

export default RecipeCategory;
