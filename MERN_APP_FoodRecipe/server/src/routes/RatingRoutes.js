import express from "express";
import jwt from "jsonwebtoken";
import { Recipes } from "../models/Recipe.js";
import { User } from "../models/Users.js";
import { Comment } from "../models/Comments.js";
import { Ratings } from "../models/Ratings.js";
import mongoose from "mongoose";

const router = express.Router();

// Middleware to verify user request 
const verifyUser = (req, res, next) => {
    const cookieHeader = req.headers.cookie;

    if (!cookieHeader) {
        return res.json({ 
            status: 401,
            message: 'Unauthorized: No token provided' 
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
                message: 'Unauthorized: contact Admin' 
            });
        }

        next();

    } catch (error) {
        return res.json({ 
            status: 401,
            message: 'Unauthorized: Invalid token' 
        });
    }
};


//***********\\\\\\////// WHERE ADMIN RATINGS API ROUTES BEGINS ***********//////\\\\\\\\\

router.get("/get-all-ratings", verifyUser, async(req, res) => {
    const { page = 1, limit = 5} = req.query;
    try{

        const rating = await Ratings.find() 
        .populate({                     //to get details from comment document we do populate and
            path: 'commentId',          //and nexted populate in comment document to get recipe name
            populate: {
                path: 'recipeId',
                select: 'name'
            },
            select: 'fullname rating recipeId'
        }).sort({ _id: -1 }) 
        .limit(parseInt(limit))
        .skip((page -1) * limit);

        const totalRecords = await Ratings.countDocuments(); // Count total records in the collection

        if(!rating || rating.length === 0){
            return res.json({
                status: 404,
                message: "Ratings were not found"
            });
        }

        return res.json({
            status: 200,
            ratings: rating,
            totalRecords: totalRecords
        });


    }catch(error){
        console.error("Error fetching ratings", error);
        return res.json({
            status: 500,
            message: "Internal Server Error",
        })
    }


});



router.delete("/delete-ratings/:id", verifyUser, async(req, res) => {
    try{

        const {id} = req.params;

        const deleteRatings = await Ratings.findByIdAndDelete(id);
    
        // Check if category is found and deleted
        if (!deleteRatings) {
            return res.json({
                status: 404,
                message: "Rating data not found"
            });
        }else{
            return res.json({
                status: 200,
                message: "Rating was deleted successfully"
            });
        }

    }catch (error) {
        console.error('Error deleting Rating:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
        });
    }

})





//***********\\\\\\////// WHERE USER RATINGS API ROUTES BEGINS ***********//////\\\\\\\\\

router.get("/get-user-ratings", verifyUser, async(req, res) => {
    const { page = 1, limit = 5} = req.query;

    const user = req.user.userId;

    const convert = new mongoose.Types.ObjectId(user); //Converting user ID from cookie into mongooes obj

    try {
        // Find ratings from comment document that matches logged user ID
        const ratings = await Comment.find({ chefId: convert })
            .populate('recipeId', 'name')
            .sort({ _id: -1 })
            .limit(parseInt(limit))
            .skip((page - 1) * limit);
       
       // Count the total records that match the chefId filter
       const totalRecords = await Comment.countDocuments({chefId: convert});

        if (!ratings || ratings.length === 0) {
            return res.json({
                status: 404,
                message: "No rating for this user"
            });
        }
        
        return res.status(200).json({
            status: 200,
            ratings: ratings,
            totalRecords: totalRecords
        });
    } catch (error) {
        console.error("Error fetching ratings", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
        });
    }
});






export {router as RatingRoutes}