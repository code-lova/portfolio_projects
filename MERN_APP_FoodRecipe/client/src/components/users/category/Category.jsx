import React from 'react';
import { Link } from 'react-router-dom';
import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";



const Category = () => {

    return (
        <div>
            <div className="main-content">
                <h2>Categories
                    {/* <Link to="/user/add-category">
                        <span className="other-h2-span">Add Category</span>
                    </Link> */}
                </h2>

                <div className="other-large-display">

                    <div className="user-card">
                        <div className="other-header">
                            <h3>List of all Caretgries</h3>
                        </div>
                        <div className="other-body">

                            <div className="table-container">

                                <table className="responsive-table">
                                    <thead>
                                        <tr>
                                            <th>HSN</th>
                                            <th>Category Name</th>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>

    )

}

export default Category