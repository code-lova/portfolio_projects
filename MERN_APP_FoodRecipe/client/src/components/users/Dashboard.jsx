import React,{useState, useEffect} from "react";
import * as IoIcons from "react-icons/io";
import * as FaIcons from "react-icons/fa6";
import chefImage from "../../assets/images/chef.webp";
import axios from "axios";


const Dashboard = () => {


    const [UserRecipe, setUserRecipe] = useState(0);

    const [UserRatings, setUserRatings] = useState(0);

    const [UserComments, setUserComments] = useState(0);


    const [loading, setLoading] = useState(false)

    useEffect(() => {
        dashboardDetails()
    },[]);

    const dashboardDetails = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`http://localhost:3000/api/count-data`);
            const { status, recipeCount, ratingCount, commentCount } = response.data; // Destructure user data from response
            if (status === 200) {
                setUserRecipe(recipeCount);
                setUserRatings(ratingCount);
                setUserComments(commentCount)
            } 
        } catch (error) {
            console.error('Error fetching cat data:', error);
            toast.error('Unable to fetch data');
        }finally{
            setLoading(false)
        }
    };

    


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
            <div className="main-content">
                <h2>Dashboard
                    <span className="login-time">Login time</span>
                </h2>


                <div className="user-large-display">

                    <div className="user-large-child-1">
                        <img src={chefImage} alt="chef-chi logo chef" loading="lazy"/>
                    </div>

                    <div className="user-large-child-2">
                        
                        <div className="card-2">
                            <div className="card-header">
                                <h3>Recipies</h3>
                                <FaIcons.FaBlender className="icons"/>
                            </div>
                            <div className="card-body">
                                <h3>{UserRecipe}</h3>
                            </div>
                        </div>

                        <div className="card-3">
                            <div className="card-header">
                                <h3>Star Ratings</h3>
                                <FaIcons.FaFaceGrinStars className="icons"/>
                            </div>
                            <div className="card-body">
                                <h3>{UserRatings}</h3>
                            </div>
                        </div>

                        <div className="card-4">
                            <div className="card-header">
                                <h3>Comments</h3>
                                <IoIcons.IoIosChatbubbles className="icons"/>
                            </div>
                            <div className="card-body">
                                <h3>{UserComments}</h3>
                            </div>
                        </div>
                    </div>
                    

                </div>
            </div>

        </div>


    );

}

export default Dashboard;
