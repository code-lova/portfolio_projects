import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";
import * as IoIcons from "react-icons/io";
import axios from 'axios';
import {toast} from "react-toastify"

const AdminRatings = () => {

    const [ratings, setRatings] = useState([]);
    const [IsLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    let pageLimit = 5;

    useEffect(() => {

     fetchAllRatings();

    }, [page]);

    const fetchAllRatings = async() => {
        setIsLoading(true)
        try{

            const response = await axios.get(`http://localhost:3000/api/get-all-ratings`, {
                params: {
                    page: page,
                    limit: pageLimit
                }
            });
            if(response.data && response.data.ratings){
                setRatings(response.data.ratings);
                setTotalRecords(response.data.totalRecords);
            }else{
                console.error("Unexpected response status", response.data)
            }

        }catch(error){
            console.error("Unable to fetch ratings", error)
        }finally{
            setIsLoading(false);
        }
    }


    //PAGINATION

    //Next Page
    const nextPage = () => {
        setPage(page + 1);

    }
    //Previous Page
    const prevPage = () => {
        setPage(page - 1);
    }

    
     // Function to get ordinal suffix
     const getOrdinalSuffix = (day) => {
        if (day >= 11 && day <= 13) {
            return "th";
        }
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };




    const deleteStarRatingBtn = (e, id) => {
        e.preventDefault();

        let answer = confirm("Confirm delete data..!!");
        if(answer){

            const thisClicked = e.currentTarget; //setting the selected value as a target to be deleted.

            thisClicked.innerHTML = "Deleting..." //This 2 lines will change the text in the button onced clicked.
    
            axios.delete(`http://localhost:3000/api/delete-ratings/${id}`).then(res => {
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




    // Calculate total number of pages
    const totalPages = Math.ceil(totalRecords / 5);



    let rating_HTML_template = "";

    if(ratings.lenght === 0){
        rating_HTML_template = <tr>
            <td className="no-data-available" colSpan="5">There are no ratings available yet</td>
        </tr>
    }else{

        rating_HTML_template = ratings.map((data, i) => {

            //Formated dat of when chefs account was created
            const date = new Date(data.createdAt);
            const day = date.getDate();
            const suffix = getOrdinalSuffix(day);
            const formattedDate = `${date.toLocaleString('default', { month: 'long' })} ${day}${suffix}, ${date.getFullYear()}`;

            return(
                <tr key={i}>
                    <td>{i + 1 + (page -1) * 5}</td>
                    <td>{data.commentId.recipeId.name}</td>
                    <td>{data.commentId.fullname}</td>
                    <td>
                        {[...Array(data.commentId.rating)].map((star,index) =>(
                            <span key={index}><IoIcons.IoMdStar /></span>
                        ))}
                    </td>
                    <td>{formattedDate}</td>
                    <td className='table-icon'>
                    
                        <Link onClick={(e) => deleteStarRatingBtn(e, data._id)}>
                            <RiIcons.RiDeleteBinLine title='Delete' className='table-icon-delete'/>
                        </Link>
                    </td>
                </tr>
            )
        })
    }


    if(IsLoading){
        return(
            <div className="spinner-container">
                <div className="spinner"></div>
                <h4>Loading...</h4>
            </div>
        )
    }



    return (
        <div>
             <div className="admin-main-content">
                <h2>Chefs Ratings</h2>

                <div className="admin-display">

                    <div className="user-card">
                        <div className="other-header">
                            <h3>Star Ratings</h3>
                        </div>
                        <div className="other-body">

                            <div className="table-container">

                            <table className="responsive-table">
                                    <thead>
                                        <tr>
                                            <th>S/N</th>
                                            <th>Recipe Name</th>
                                            <th>Customer Name</th>
                                            <th>Rating</th>
                                            <th>Created at</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rating_HTML_template}
                                       
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

    )

}

export default AdminRatings