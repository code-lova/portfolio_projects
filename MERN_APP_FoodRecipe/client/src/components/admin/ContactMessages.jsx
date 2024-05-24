import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import * as FaIcons from "react-icons/fa6";
import * as RiIcons from "react-icons/ri";
import axios from 'axios';


const ContactMessages = () => {

    const [message, setMessages] = useState([]);
    const [IsLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [modal, setModal ] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);

    let pageLimit = 5;

    useEffect(() => {
        fetchAllMessages();
    },[page]);

    const fetchAllMessages = async() => {
        setIsLoading(true)
        try{
            const response = await axios.get(`http://localhost:3000/api/fetch-messages`, {
                params: {
                    page: page,
                    limit: pageLimit
                }
            });
            if(response.data && response.data.messageData){
                setMessages(response.data.messageData)
                setTotalRecords(response.data.totalRecords)
            }else{
                console.error("Unexpected response status", response.data);
            }

        }catch(error){
            console.error("Problem fetching message", error);
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


    const openModal = (message) => {
        setModal(true);
        setSelectedMessage(message);
    }

    const closeModal = () => {
        setModal(false);
        setSelectedMessage(null);
    }



    const deleteMessage = (e, id) => {
        e.preventDefault();

        let answer = confirm("Confirm delete data..!!");
        if(answer){

            const thisClicked = e.currentTarget; //setting the selected value as a target to be deleted.

            thisClicked.innerHTML = "Deleting..." //This 2 lines will change the text in the button onced clicked.
    
            axios.delete(`http://localhost:3000/api/delete-message/${id}`).then(res => {
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

    let messageHTML_TEMPLATE = "";

    if(message.length === 0){

        messageHTML_TEMPLATE = <tr>
            <td className="no-data-available" colSpan="5">There are not message available</td>
        </tr>
    }else{

        messageHTML_TEMPLATE = message.map((data, i) => {

            
            return(
                <tr key={i}>
                    <td>{i + 1 + (page - 1) * 5}</td>
                    <td>{data.userId.name}</td>
                    <td>{data.userId.email}</td>
                    <td>{data.subject}</td>
                    <td className='table-icon'>
                        <Link to="#">
                            <FaIcons.FaRegEye onClick={() => openModal(data)} title='View/Edit' className='table-icon-edit'/>
                        </Link>
                        <Link onClick={(e) => deleteMessage(e, data._id)}>
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
                <h2>Contact Messages</h2>

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
                                            <th>Chef Name</th>
                                            <th>Email</th>
                                            <th>Subject</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {messageHTML_TEMPLATE}
                                        {/* <tr>
                                            <td>Data 1</td>
                                            <td>Data 2</td>
                                            <td>jane@gmail.com</td>
                                            <td>ginger bread man </td>
                                            <td className='table-icon'>
                                                <Link to="#">
                                                    <FaIcons.FaRegEye onClick={openModal} title='View/Edit' className='table-icon-edit'/>
                                                </Link>
                                                <Link to="#">
                                                    <RiIcons.RiDeleteBinLine title='Delete' className='table-icon-delete'/>
                                                </Link>
                                            </td>
                                        </tr> */}
                                        
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
                                                    defaultValue={selectedMessage ?.message || ""}>
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

export default ContactMessages