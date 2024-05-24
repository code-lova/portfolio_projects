import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";

const AdminFooter = () => {

    const [fullYear, setFullyear] = useState("");

    useEffect(() => {
        const date = new Date().getFullYear();
        setFullyear(date);
    }, [])

    return(
        <div>
            <div className="admin-other-footer">
                <p>&copy; {fullYear} ChefChi. All rights reserved.
                Made with love by <Link to="https://github.com/code-lova" target='__blank'>#Code-Love$</Link></p>
            </div>
        </div>

    );

}

export default AdminFooter;
