import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";
import axios from "axios";

const AdminRecipe = () => {

    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const [userRecipes, setUserRecipes] = useState([]);

    const [IsLoading, setIsLoading] = useState(true)

    let pageLimit = 6;

    useEffect(() => {
      displayUserRecipes()
    }, [page])
    
    const displayUserRecipes = async() => {
        try{
            const response = await axios.get(`http://localhost:3000/api/show-admin-all-recipe?page=${page}&limit=${pageLimit}`);
            // console.log("API response",response);
            if (response.data && response.data.recipeDatas) {
                setUserRecipes(response.data.recipeDatas);
                setTotalRecords(response.data.totalRecords);
                setIsLoading(false);

            } else {
                console.error('Unexpected response structure:', response.data);
            }
        }catch(error) {
            console.error('Error fetching all recipes:', error);
        }finally{
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


    const deleteRecipe = (e, id) => {
        e.preventDefault();

        let answer = confirm("Confirm delete data..!!");
        if(answer){

            const thisClicked = e.currentTarget; // Getting the button element clicked

            thisClicked.innerHTML = "Deleting..." // Change button text to "Deleting...".
    
            axios.delete(`http://localhost:3000/api/delete-recipes/${id}`).then(res => {
                if(res.data.status === 200){
                    toast.success(res.data.message, {
                        theme: 'colored'
                    });
                    thisClicked.closest(".recipe-list-cards").remove(); // Remove the parent div
                }else{
                    toast.error(res.data.message, {
                        theme: 'colored'
                    });
                    thisClicked.innerHTML = "Delete"; // Revert button text
                }
            }).catch(error => {
                console.log("Error deleting Recipe", error);
                thisClicked.innerHTML = "Delete"; // Revert button text
            })
        }
    }


   




    // Calculate total number of pages
    const totalPages = Math.ceil(totalRecords / pageLimit);

    let Recipe_LIST_HTML = "";

    if(userRecipes.length === 0){
        Recipe_LIST_HTML = <div>
            <div className="recipe-list-cards">
                <h3>Recipes have not been created</h3>
            </div>
        </div>
    }else{

        Recipe_LIST_HTML = userRecipes.map((recipe) => {
            return(
                
                <div key={recipe._id} className="recipe-list-cards">
                    <Link to={`/admin/view-recipe/${recipe.slug}`}>
                        <img src={`http://localhost:3000/uploads/${recipe.file}`} alt={recipe.name}  height={250}/>
                        <h3>{recipe.name}</h3>
                    </Link>
                    <button onClick={(e) => deleteRecipe(e, recipe._id)}>
                       <span><RiIcons.RiDeleteBinLine title='Delete' className='recipe-card-delete-icon'/></span> Delete
                    </button>
                </div>
                
            )
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
                <h2>All Recipies</h2>

                <div className="admin-display">

                    <div className="user-card">
                        <div className="other-header">
                            <h3>List of Recipes</h3>
                        </div>
                        <div className="other-body">

                            <div className="recipe-card">
                                {Recipe_LIST_HTML}
                            </div>
                            <div className="recipe-card-page-button">
                                {page > 1 && <button onClick={prevPage}>{"<"}-Previous</button>}
                                {page < totalPages && <button onClick={nextPage}>Next-{">"}</button>}
                            </div>

                            {/* <div className="table-container">

                                <table className="responsive-table">
                                    <thead>
                                        <tr>
                                            <th>HSN</th>
                                            <th>Recipe Name</th>
                                            <th>Header 3</th>
                                            <th>Header 4</th>
                                            <th>Header 5</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Data 1</td>
                                            <td>Data 2</td>
                                            <td>Data 3</td>
                                            <td>cateliag finsfre</td>
                                            <td>ginger bread man </td>
                                            <td className='table-icon'>
                                                <Link to="/admin/view-recipe">
                                                    <FaIcons.FaRegEdit title='View/Edit' className='table-icon-edit'/>
                                                </Link>
                                                <Link to="#">
                                                    <RiIcons.RiDeleteBinLine title='Delete' className='table-icon-delete'/>
                                                </Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Data 1</td>
                                            <td>Data 2</td>
                                            <td>Data 3</td>
                                            <td>Data 4</td>
                                            <td>Data 5</td>
                                            <td className='table-icon'>
                                                <Link to="#">
                                                    <FaIcons.FaRegEdit title='View/Edit' className='table-icon-edit'/>
                                                </Link>
                                                <Link to="#">
                                                    <RiIcons.RiDeleteBinLine title='Delete' className='table-icon-delete'/>
                                                </Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Data 1</td>
                                            <td>Data 2</td>
                                            <td>Data 3</td>
                                            <td>Data 4</td>
                                            <td>Data 5</td>
                                            <td className='table-icon'>
                                                <Link to="#">
                                                    <FaIcons.FaRegEdit title='View/Edit' className='table-icon-edit'/>
                                                </Link>
                                                <Link to="#">
                                                    <RiIcons.RiDeleteBinLine title='Delete' className='table-icon-delete'/>
                                                </Link>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div> */}
                        </div>
                    </div>
                </div>

            </div>
            

        </div>


    );

}

export default AdminRecipe;
