import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/Users.js";
import {Category} from "../models/Category.js";
import mongoose from "mongoose";
import { Recipes } from "../models/Recipe.js";
import { Comment } from "../models/Comments.js";




const router = express.Router();

// Middleware to verify user request 
const verifyUser = (req, res, next) => {
    const cookieHeader = req.headers.cookie;

    if (!cookieHeader) {
        return res.json({ 
            status: 401,
            message: 'Unauthorized' 
        });
    }

    // Parse the cookie header
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
    }, {});

    const token = cookies.token;

    try {

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;

         // Check if user status is 1 = active
         if (decoded.status !== 1) {
            return res.json({ 
                status: 401,
                message: 'Unauthorized' 
            });
        }

        next();



    } catch (error) {
        return res.json({ 
            status: 401,
            message: 'Unauthorized' 
        });
    }
};


///=======ADMIN DASHBOARD ROUTES STARTS HERE====\\\\\ 
router.get("/show-user-activity", verifyUser, async(req, res) => {
    try{

        const category = await Category.find().countDocuments();

        const userCount = await User.find({role: 0}).countDocuments();

        const user = await User.find({role: 0}).limit(4);

        return res.json({
            status: 200,
            countCategory: category,
            countUSer: userCount,
            userActivity: user
        });

    }catch(error){
        console.error("Error Updating Chef's ID", error)
        return res.json({
            status: 500,
            message: "Internal server error"
        })
    }
});




///=======USER DASHBOARD ROUTES STARTS HERE====\\\\\ 

router.get("/count-data", verifyUser, async(req, res) => {
    const user = req.user.userId;
    const convert = new mongoose.Types.ObjectId(user);
    try{

        // count recipes where userId matches the logged-in user
        const CountRecipeNumber = await Recipes.find().countDocuments({userId: convert});


        // Find comments where chefId matches the logged-in user
        const comments = await Comment.find({ chefId: convert });
        // Calculate the total rating and average rating
        const totalRating = comments.reduce((sum, comment) => sum + (comment.rating || 0), 0);
        const ratingCount = comments.filter(comment => comment.rating).length;
        const finalRating = ratingCount > 0 ? totalRating / ratingCount : 0;
        const wholeRating = Math.ceil(finalRating);


        // count comments where chefId matches the logged-in user
        const countComments = await Comment.find().countDocuments({ chefId: convert });

        return res.json({
            status: 200,
            recipeCount: CountRecipeNumber,
            ratingCount: wholeRating,
            commentCount: countComments
        })



    }catch(error){
        console.error("Problem fetching data");
        return res.json({
            status: 500,
            message: "Internal Server Error"
        })
    }
});



export {router as DashboardRouter};