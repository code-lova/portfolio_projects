import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import img1 from "../../assets/images/searching.gif";
import axios from "axios";



const Search = () => {

    const [page, setPage] = useState(1);
    
    const [totalRecords, setTotalRecords] = useState(0);

    const [recipes, setRecipes] = useState([]);

    const [sortOption, setSortOption] = useState("latest");

    const [searchQuery, setSearchQuery] = useState("");

    const [isLoading, setIsLoading] = useState(false);


    let pageLimit = 20;

    useEffect(() => {
        
        if (searchQuery) {
            displayRecipes();
        } else {
            setRecipes([]);
        }
    }, [page, sortOption, searchQuery])
    
    const displayRecipes = async() => {
        setIsLoading(true); // Show spinner
        try{
            const response = await axios.get(`http://localhost:3000/api/search-recipe`, {
                params: {
                    page: page,
                    limit: pageLimit,
                    sort: sortOption,
                    search: searchQuery
                }
            });
           
            if (response.data && response.data.userData) {
                setRecipes(response.data.userData);
                setTotalRecords(response.data.totalRecords);
            } else {
                setRecipes([]);
                console.error('Unexpected response structure:', response.data);
            }
        }catch(error) {
            console.error('Error fetching recipes:', error);
            setRecipes([]); // Clear recipes on error
        }finally{
            setIsLoading(false); // Hide spinner
        }
    }


    //Pagination

    //Next Page
    const nextPage = () => {
        setPage(page + 1);
    }

    //Previous Page
    const prevPage = () => {
        setPage(page - 1);
    }

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    }

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1); // Reset to first page on new search
        if(searchQuery){
            displayRecipes();
        }
    }


     // Calculate total number of pages
     const totalPages = Math.ceil(totalRecords / pageLimit);

     let Recipe_LIST_HTML = "";
 
     if(recipes.length === 0){
         Recipe_LIST_HTML = <div>
                <div>
                    <img src={img1} alt="waiting for input" />
                </div>
         </div>
     }else{
 
         Recipe_LIST_HTML = recipes.map((recipe) => {
             return(
                 
                 <Link to={`/recipe/${recipe.slug}`} key={recipe._id}>
                     <div className="recipes-card">
                         <img src={`http://localhost:3000/uploads/${recipe.file}`} alt={recipe.name} loading='lazy' width={50}  height={190}/>
 
                         <h3>Chef {recipe.name}</h3>
 
                     </div>     
                     <div className="recipe-details-flexible">
                         
                         <div className="details">
                             <span className="rating">&#9733;</span>
                             <span className="xsmall-left">{recipe.ratings}</span>
                             <span>({recipe.comment_count})</span>
                         </div>
 
                         <div className="details">
                             <h4>By Chef {recipe.userId.name}</h4>
                         </div>
 
                     </div>          
                 </Link>
                 
             )
         });
     }


    return(
        <div className="recipe-search">
            <h2>Search for your Recipe</h2>


            <div className="large-section">
                <div className="card1">
                    <form action="" className="search" onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            placeholder="Search for recipes..."
                            alt="search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <div className="search-icon" onClick={handleSearchSubmit}>
                            &#128269;
                        </div>
                    </form>
                </div>

                <div className="card2">
                    <select name="sort" id="sort" className="filter" onChange={handleSortChange}>
                        <option value="latest">Sort by: latest</option>
                        <option value="top-rated">Sort by: top rated</option>
                        <option value="trending">Sort by: trending</option>
                    </select>
                </div>
            </div>
                   


          
                {isLoading ? (
                    <div className="spinner-container">
                        <div className="spinner"></div>
                        <h4>Loading...</h4>
                    </div>
                ) : (
                    <div className="recipe-grid">
                        {Recipe_LIST_HTML}
                    </div>
                )}

                

           

            <div className="recipe-card-page-button">
                {page > 1 && <button onClick={prevPage}>{"<"}-Previous</button>}
                {page < totalPages && <button onClick={nextPage}>Next-{">"}</button>}
            </div>

        </div>




    );

}

export default Search;
