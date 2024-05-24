import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {

    const [fullYear, setFullyear] = useState("");

    useEffect(() => {
        const date = new Date().getFullYear();
        setFullyear(date);
    }, [])



    return (
        <div>
            <div className="other-footer">
                <p>&copy; {fullYear} ChefChi. All rights reserved.
                Made with love by <Link to="https://github.com/code-lova" target='__blank'>#Code-Love$</Link></p>

            </div>
        </div>

    )
}

export default Footer