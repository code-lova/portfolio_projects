import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";
import axios from "axios";

const Chefs = () => {

    const [chefs, setChefs] = useState([]);
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    useEffect(() => {

        fetchAllChefs();

    },[page]);

    const fetchAllChefs = async() => {
        try{

            const response = await axios.get(`http://localhost:3000/api/fetchchefs?page=${page}&limit=5`);

            setChefs(response.data.chefs);
            setTotalRecords(response.data.totalRecords);
            setLoading(false);

        }catch(error){
            console.error("Error fetching Chef: ", error)
        }
    };


    //PAGINATION

    //Next Page
    const nextPage = () => {
        setPage(page + 1);

    }
    //Previous Page
    const prevPage = () => {
        setPage(page - 1);
    }

    

    const deleteChef = (e, id) => {
        e.preventDefault();

        let answer = confirm("Confirm delete data..!!");
        if(answer){

            const thisClicked = e.currentTarget; // Getting the button element clicked

            thisClicked.innerHTML = "Deleting..." // Change button text to "Deleting...".
    
            axios.delete(`http://localhost:3000/api/delete-chef/${id}`).then(res => {
                if(res.data.status === 200){
                    toast.success(res.data.message, {
                        theme: 'colored'
                    });
                    thisClicked.closest("tr").remove(); // Remove the parent div
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
    const totalPages = Math.ceil(totalRecords / 5);


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


    let ChefList_HTML = "";
 
    if(chefs.length === 0){
 
         ChefList_HTML = <tr>
             <td className="no-data-available" colSpan="5">There are 0 registered Chefs</td>
         </tr>
    }else{
        ChefList_HTML = chefs.map((item, i) => {
            const statusText = item.status === 1 ? 'Active' : 'Blocked';
            const VerifyText = item.emailVarify === 1 ? 'Verified' : 'UnVerified';

            let verifyStyle = "";

            if(item.emailVarify === 1){
                verifyStyle = "active-capsul";
            }else{
                verifyStyle = "blocked-capsul";
            }

            //Formated dat of when chefs account was created
            const date = new Date(item.createdAt);
            const day = date.getDate();
            const suffix = getOrdinalSuffix(day);
            const formattedDate = `${date.toLocaleString('default', { month: 'long' })} ${day}${suffix}, ${date.getFullYear()}`;
               

            return (
                <tr key={i}>
                     <td>{i + 1 + (page - 1) * 5}</td>
                     <td>{item.name}</td>
                     <td>{item.email}</td>
                     <td>
                        <span className={verifyStyle}>
                            {VerifyText}
                        </span>
                     </td>
                     <td>{statusText}</td>
                     <td>{formattedDate}</td>
                     <td className='table-icon'>
                         <Link to={`/admin/view-chef/${item._id}`}>
                             <button>
                                 <span><FaIcons.FaRegEdit title='View/Edit' className='table-icon-edit'/></span>
                                 View
                             </button>
                         </Link>
                         
                         <button onClick={(e) => deleteChef(e, item._id)}>
                             <span><RiIcons.RiDeleteBinLine title='Delete' className='table-icon-delete'/></span> Delete
                         </button>
                         
                     </td>
                </tr>
            )
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

    return(
        <div>
            <div className="admin-main-content">
                <h2>All Chef
                    {/* <Link to="/user/add-recipes">
                        <span className="other-h2-span">Add Recipes</span>
                    </Link> */}
                </h2>

                <div className="admin-display">

                    <div className="user-card">
                        <div className="other-header">
                            <h3>List of Chefs</h3>
                        </div>
                        <div className="other-body">

                            <div className="table-container">

                                <table className="responsive-table">
                                    <thead>
                                        <tr>
                                            <th>S/N</th>
                                            <th>Chef Name</th>
                                            <th>Email</th>
                                            <th>Email Verified</th>
                                            <th>Status</th>
                                            <th>Created at</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ChefList_HTML}
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

export default Chefs;
