import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import * as FaIcons from "react-icons/fa6";
import * as RiIcons from "react-icons/ri";
import axios from 'axios';

const AdminComments = () => {

    const [comment, setComment] = useState([]);
    const [IsLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [modal, setModal ] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);

    let pageLimit = 5;

    useEffect(() => {
        fetchAllComment();
    },[page]);

    const fetchAllComment = async() => {
        setIsLoading(true)
        try{
            const response = await axios.get(`http://localhost:3000/api/fetch-comment`, {
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



    const deleteComment = (e, id) => {
        e.preventDefault();

        let answer = confirm("Confirm delete data..!!");
        if(answer){

            const thisClicked = e.currentTarget; //setting the selected value as a target to be deleted.

            thisClicked.innerHTML = "Deleting..." //This 2 lines will change the text in the button onced clicked.
    
            axios.delete(`http://localhost:3000/api/delete-comment/${id}`).then(res => {
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
                        <Link to="#">
                            <FaIcons.FaRegEye onClick={() => openModal(data)} title='View/Edit' className='table-icon-edit'/>
                        </Link>
                        <Link onClick={(e) => deleteComment(e, data._id)}>
                            <RiIcons.RiDeleteBinLine title='Delete' className='table-icon-delete'/>
                        </Link>
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


    return (
        <div>
            <div className="admin-main-content">
                <h2>Chefs Public Comments</h2>

                <div className="admin-display">
                    <div className="user-card">
                        <div className="other-header">
                            <h3>List of Comments</h3>
                        </div>
                        <div className="other-body">
                            <div className="table-container">
                                <table className="responsive-table">
                                    <thead>
                                        <tr>
                                            <th>S/N</th>
                                            <th>Customer</th>
                                            <th>Recipe</th>
                                            <th>Created</th>
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

export default AdminComments