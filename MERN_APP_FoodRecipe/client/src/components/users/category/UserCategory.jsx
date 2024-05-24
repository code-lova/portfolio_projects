import React from 'react';

const UserCategory = () => {

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
                            <h3>List of Categories</h3>
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Data 1</td>
                                            <td>Data 2</td>
                                            <td>Data 3</td>
                                            <td>cateliag finsfre</td>
                                            <td>ginger bread man </td>
                                           
                                        </tr>
                                        <tr>
                                            <td>Data 1</td>
                                            <td>Data 2</td>
                                            <td>Data 3</td>
                                            <td>Data 4</td>
                                            <td>Data 5</td>
                                            
                                        </tr>
                                        <tr>
                                            <td>Data 1</td>
                                            <td>Data 2</td>
                                            <td>Data 3</td>
                                            <td>Data 4</td>
                                            <td>Data 5</td>
                                           
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

export default UserCategory