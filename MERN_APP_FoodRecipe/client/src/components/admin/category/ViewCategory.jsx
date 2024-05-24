import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const ViewCategory = () => {


    const [btnLoading, setBtnLoading] = useState(false);

    const [loading, setLoading] = useState(true);
    
    const [categoryInput, setCategoryInput] = useState([]);

    let {id} = useParams();


    useEffect(() => {

        getCategoryId()

    }, [id]);

    const getCategoryId = async() => {

        try{
            const response = await axios.get(`http://localhost:3000/api/editcategory/${id}`);

            const {status, message} = response.data

            switch (status){
                case 200:
                    setCategoryInput(response.data.category);
                    setLoading(false);
                    break;
                case 404:
                case 500:
                    toast.error(message, {
                        theme: 'colored'
                    });
                    break;
                default:
                    console.error("Unexpected status response:", status)
            
            }
        }catch(error){
            console.error("Error fetching category ID:", error);
        }finally{
            setLoading(false);
        }
    }

    if(loading){
        return(
            <h3 className="admin-main-content">Loading Category...</h3>
        )
    }



    const handleInput = (e) => {
        e.persist();
        setCategoryInput({...categoryInput, [e.target.name]: e.target.value});
    }

    const UpdateCategory = async(e) => {
        e.preventDefault();
        setBtnLoading(true);

        const data = categoryInput;

        try{

            const response = await axios.put(`http://localhost:3000/api/updatecategory/${id}`, data);

            const {status, message } = response.data;

            switch (status) {

                case 200:
                    toast.success(message, {
                        theme: 'colored'
                    });
                    break;
                case 422:
                    toast.warning(message, {
                        theme: 'colored'
                    });
                    break;
                case 500:
                    toast.error(message, {
                        theme: 'colored'
                    });
                    break;
                default:
                    console.log("Unexpected response status:", status);
            }

        }catch(error){
            console.error("Error createing category: ", error);
            toast.error('Please try again later.', { theme: 'colored' });
        }
        setBtnLoading(false); // Set Btnloading to false after form submission


    }


    return(
        <div>
        <div className="admin-main-content">
            <h2>Add Category
                <Link to="/admin/categories">
                    <span className="other-h2-span">Go Back</span>
                </Link>
            </h2>

            <div className="admin-display">
                <div className="user-card">
                    <div className="other-header">
                        <h3>Create New Category</h3>
                    </div>
                    <div className="other-body">
                        <form onSubmit={UpdateCategory}>
                            <div className="group-12">
                                <div className="forms-groups">
                                    <label htmlFor="category-name">Category Name:</label>
                                    <input type="text" name="name" onChange={handleInput} value={categoryInput.name} placeholder="Enter category name" required />
                                </div>

                                <div className="forms-groups">
                                    <label htmlFor="category-name">Slug:</label>
                                    <input type="text" name="slug" onChange={handleInput} value={categoryInput.slug} placeholder="Enter Slug" readOnly />
                                </div>
                            </div>

                            <div className="group-12">
                                <div className="forms-groups">
                                    <label htmlFor="category-name">Description:</label>
                                    <textarea name="description" onChange={handleInput} value={categoryInput.description} cols="30" rows="10" required></textarea>
                                </div>

                                <div className="forms-groups">
                                    <label htmlFor="status">Status:</label>
                                    <select name="status" onChange={handleInput} value={categoryInput.status}>
                                        <option value="0">Hidden</option>
                                        <option value="1">Show</option>
                                    </select>
                                </div>
                            </div>

                            <hr />
                            <h2>SEO Meta Tags</h2>

                            <div className="group-12">
                                <div className="forms-groups">
                                    <label htmlFor="meta_title">Meta Title</label>
                                    <input type="text" name="meta_title" onChange={handleInput} value={categoryInput.meta_title} placeholder="Enter meta title" />
                                </div>

                                <div className="forms-groups">
                                    <label htmlFor="meta_keyword">Meta Keywords:</label>
                                    <textarea name="meta_keywords" onChange={handleInput} value={categoryInput.meta_keywords} cols="30" rows="10"></textarea>
                                </div>
                            </div>
                            <div className="forms-groups">
                                <label htmlFor="meta-desc">Meta Description:</label>
                                <textarea name="meta_description" onChange={handleInput} value={categoryInput.meta_description} cols="30" rows="10"></textarea>
                            </div>

                            <div className="group-6">
                                <button type="submit" disabled={btnLoading}>{btnLoading ? 'Updating...': 'Update Category'}</button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>



        </div>

        

    </div>


    );

}

export default ViewCategory;
