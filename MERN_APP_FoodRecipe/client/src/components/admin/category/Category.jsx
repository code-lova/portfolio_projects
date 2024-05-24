import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";
import axios from "axios";
import { toast } from "react-toastify";

const Category = () => {

    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    useEffect(() => {
        fetchCategories();
    },[page]);

    const fetchCategories = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`http://localhost:3000/api/fetchcategories?page=${page}&limit=5`);
            setCategories(response.data.categories);
            setTotalRecords(response.data.totalRecords);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }finally{
            setLoading(false)
        }
    };

    

    //Pagination

    //Next Page
    const nextPage = () => {
        setPage(page + 1);

    }
    //Previous Page
    const prevPage = () => {
        setPage(page - 1);
    }



    //Handling deleting category ID
    const deleteCategory = (e, id) => {
        e.preventDefault();

        let answer = confirm("Confirm delete data..!!");
        if(answer){

            const thisClicked = e.currentTarget; //setting the selected value as a target to be deleted.

            thisClicked.innerHTML = "Deleting..." //This 2 lines will change the text in the button onced clicked.
    
            axios.delete(`http://localhost:3000/api/deletecategory/${id}`).then(res => {
                switch (res.data.status) {
                    case 200:
                        handleSuccess(res.data.message);
                        thisClicked.closest("tr").remove();
                        break;
                    case 404:
                        handleError(res.data.message);
                        break;
                    default:
                        console.error("Unexpected response status:", res.data.status)
                }
            }).catch(error => {
                console.log("Error deleting Category", error);
                handleError(res.data.message);
            })
        }

    }


    //Success function
    function handleSuccess(message){
        toast.success(message, {
            theme: 'colored'
        });
    }

    //error function 
    function handleError(message){
        toast.error(message, {
            theme: 'colored'
        });
    }




    if(loading){
        return(
            <div className="spinner-container">
                <div className="spinner"></div>
                <h4>Loading...</h4>
            </div>
        )
    }


    // Calculate total number of pages
    const totalPages = Math.ceil(totalRecords / 5);

    let CategoryList_HTML = "";

    if(categories.length === 0){

        CategoryList_HTML = <tr>
            <td className="no-data-available" colSpan="5">There are not categories available</td>
        </tr>
    }else{
        CategoryList_HTML = categories.map((item, i) => {
            const statusText = item.status === 1 ? 'Show' : 'Hidden';
            return (
                <tr key={i}>
                    <td>{i + 1 + (page - 1) * 5}</td>
                    <td>{item.name}</td>
                    <td>{item.slug}</td>
                    <td>
                        {statusText}

                    </td>
                    <td className='table-icon'>
                        <Link to={`/admin/edit-category/${item._id}`}>
                            <button>
                                <span><FaIcons.FaRegEdit title='View/Edit' className='table-icon-edit'/></span>
                                View
                            </button>
                        </Link>
                        
                        <button onClick={(e) => deleteCategory(e, item._id)}>
                            <span><RiIcons.RiDeleteBinLine title='Delete' className='table-icon-delete'/></span> Delete
                        </button>
                        
                    </td>
                </tr>
            )
        });
    }

    return(
        <div>
            <div className="admin-main-content">
                <h2>Meal Categories
                    <Link to="/admin/add-category">
                        <span className="other-h2-span">Add Category</span>
                    </Link>
                </h2>

                <div className="admin-display">
                    <div className="user-card">
                        <div className="other-header">
                            <h3>List of all Caretgries</h3>
                        </div>
                        <div className="other-body">

                            <div className="table-container">

                                <table className="responsive-table">
                                    <thead>
                                        <tr>
                                            <th>S/N</th>
                                            <th>Category Name</th>
                                            <th>Slug</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {CategoryList_HTML}                                           
                                    </tbody>
                                </table>
                            </div>
                             {/* Pagination controls */}
                            <div>
                            {page > 1 && <button onClick={prevPage}>Previous</button>}
                            {page < totalPages && <button onClick={nextPage}>Next</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Category;
