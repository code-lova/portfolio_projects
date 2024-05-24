import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa6";
import * as RiIcons from "react-icons/ri";
import axios from "axios";

const Comments = () => {

    const [comment, setComment] = useState([]);
    const [IsLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [modal, setModal ] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);

    let pageLimit = 5;

    useEffect(() => {
        fetchUserComment();
    },[page]);

    const fetchUserComment = async() => {
        setIsLoading(true)
        try{
            const response = await axios.get(`http://localhost:3000/api/fetch-user-comment`, {
                params: {
                    page: page,
                    limit: pageLimit
                }
            });
            if(response.data && response.data.commentData){
                setComment(response.data.commentData)
                setTotalRecords(response.data.totalRecords)
            }else{
                console.error("Unexpected response status", response.data);
            }

        }catch(error){
            console.error("Problem fetching comment", error);
        }finally{
            setIsLoading(false);
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


    const openModal = (comment) => {
        setModal(true);
        setSelectedComment(comment);
    }

    const closeModal = () => {
        setModal(false);
        setSelectedComment(null);
    }


    // Calculate total number of pages
    const totalPages = Math.ceil(totalRecords / 5);

    let CommentList_HTML = "";

    if(comment.length === 0){

        CommentList_HTML = <tr>
            <td className="no-data-available" colSpan="5">There are not Comment available</td>
        </tr>
    }else{

        CommentList_HTML = comment.map((data, i) => {

            //Formated dat of when chefs account was created
            const date = new Date(data.createdAt);
            const day = date.getDate();
            const suffix = getOrdinalSuffix(day);
            const formattedDate = `${date.toLocaleString('default', { month: 'long' })} ${day}${suffix}, ${date.getFullYear()}`;
                
            return(
                <tr key={i}>
                    <td>{i + 1 + (page - 1) * 5}</td>
                    <td>{data.fullname}</td>
                    <td>{data.recipeId.name}</td>
                    <td>{formattedDate}</td>
                    <td className='table-icon'>
                        <button onClick={() => openModal(data)} className="comment-view">
                        <FaIcons.FaRegEye  title='View/Edit' className='table-icon-edit'/> View Comment 
                        </button>
                    </td>
                </tr>
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
            
            <div className="main-content">
                <h2>Users Comments
                    {/* <Link to="/user/add-recipes">
                        <span className="other-h2-span">Add Recipes</span>
                    </Link> */}
                </h2>

                <div className="other-large-display">

                    <div className="user-card">
                        <div className="other-header">
                            <h3>List of Comments</h3>
                        </div>
                        <div className="other-body">

                            <div className="table-container">

                                <table className="responsive-table">
                                    <thead>
                                        <tr>
                                            <th>HSN</th>
                                            <th>Recipe Name</th>
                                            <th>Customer Name</th>
                                            <th>Created at</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                       {CommentList_HTML}
                                       
                                    </tbody>
                                </table>
                                {modal && (
                                    <div className="modal-overlay">
                                        <div className="modal">
                                            <div className="modal-heading">
                                                <h2>Comments</h2>
                                                <button className="close-button" onClick={closeModal}>X</button>
                                            </div>
                                            <form >
                                                <textarea 
                                                    name="comment" 
                                                    cols="80" 
                                                    rows="10"
                                                    defaultValue={selectedComment ?.comment || ""}>
                                                </textarea>
                                            </form>
                                        </div>
                                    </div>
                                )}
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

export default Comments;
