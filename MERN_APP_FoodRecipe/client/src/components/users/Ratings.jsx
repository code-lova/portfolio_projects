import React, { useState, useEffect } from 'react';
import * as IoIcons from "react-icons/io";
import axios from 'axios';
import {toast} from "react-toastify"

const Ratings = () => {
    const [ratings, setRatings] = useState([]);
    const [IsLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    let pageLimit = 5;

    useEffect(() => {

     fetchUserRatings();

    },[page]);

    const fetchUserRatings = async() => {
        setIsLoading(true)
        try{

            const response = await axios.get(`http://localhost:3000/api/get-user-ratings`, {
                params: {
                    page: page,
                    limit: pageLimit
                }
            });
            if(response.data.status === 200){
                setRatings(response.data.ratings);
                setTotalRecords(response.data.totalRecords);
            }else{
                setRatings([]);
                //console.error("Unexpected response status", response.data)
            }

        }catch(error){
            console.error("User have no Ratings yet")
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



    // Calculate total number of pages
    const totalPages = Math.ceil(totalRecords / 5);

    let rating_HTML_template = "";

    if(ratings.length === 0){
        rating_HTML_template = <tr>
            <td className="no-data-available" colSpan="5">You have not been rated yet.</td>
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
                    <td>{data.recipeId.name}</td>
                    <td>{data.fullname}</td>
                    <td>
                        {[...Array(data.rating)].map((star,index) =>(
                            <span key={index}><IoIcons.IoMdStar /></span>
                        ))}
                    </td>
                    <td>{formattedDate}</td>
                    
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


    return(
        <div>
            <div className="main-content">
                <h2>Ratings
                    {/* <Link to="/user/add-recipes">
                        <span className="other-h2-span">Add Recipes</span>
                    </Link> */}
                </h2>

                <div className="other-large-display">

                    <div className="user-card">
                        <div className="other-header">
                            <h3>List of Ratings</h3>
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rating_HTML_template}
                                    </tbody>
                                </table>
                            </div>
                             {/* Pagination controls */}
                             <div className="recipe-card-page-button">
                                {page > 1 && <button onClick={prevPage}>{"<"}-Previous</button>}
                                {page < totalPages && <button onClick={nextPage}>Next-{">"}</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>


    );

}

export default Ratings;
