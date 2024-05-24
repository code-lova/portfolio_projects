import express from "express";
import jwt from "jsonwebtoken";
import { Recipes } from "../models/Recipe.js";
import { User } from "../models/Users.js";
import { Comment } from "../models/Comments.js";
import { Message } from "../models/Message.js";
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


//===== Routes for Admin =====
router.get("/fetch-comment", verifyUser, async(req, res) => {

    const { page = 1, limit = 5} = req.query;

    try{

        const comment = await Comment.find()
        .populate('recipeId', 'name')
        .sort({ _id: -1 })
        .limit(parseInt(limit))
        .skip((page - 1) * limit);

        const totalRecords = await Comment.countDocuments(); // Count total records in the collection

        if(!comment || comment.length === 0){
            return res.json({
                status: 404,
                message: "Comments were not found"
            });
        }

        return res.json({
            status: 200,
            commentData: comment,
            totalRecords: totalRecords
        });

    }catch(error){
        console.error("Problem fetching comments");
        return res.json({
            status: 500,
            message: "Internal Server Error"
        })
    }
})

router.delete("/delete-comment/:id", verifyUser, async(req, res) => {
    try{

        const {id} = req.params;

        const deleteComment = await Comment.findByIdAndDelete(id);
    
        // Check if comment is found and deleted
        if (!deleteComment) {
            return res.json({
                status: 404,
                message: "Comment data not found"
            });
        }else{
            return res.json({
                status: 200,
                message: "Comment was deleted successfully"
            });
        }

    }catch (error) {
        console.error('Error Deleting Comment:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
        });
    }

});

router.get("/fetch-messages", verifyUser, async(req, res) => {
    const { page = 1, limit = 5} = req.query;

    try{

        const message = await Message.find()
        .populate('userId', 'name email')
        .sort({ _id: -1 })
        .limit(parseInt(limit))
        .skip((page - 1) * limit);

        const totalRecords = await Comment.countDocuments(); // Count total records in the collection

        if(!message || message.length === 0){
            return res.json({
                status: 404,
                message: "messages were not found"
            });
        }

        return res.json({
            status: 200,
            messageData: message,
            totalRecords: totalRecords
        });

    }catch(error){
        console.error("Problem fetching comments");
        return res.json({
            status: 500,
            message: "Internal Server Error"
        })
    }

});

router.delete("/delete-message/:id", verifyUser, async(req, res) => {
    try{

        const {id} = req.params;

        const deleteMessage = await Message.findByIdAndDelete(id);
    
        // Check if message is found and deleted
        if (!deleteMessage) {
            return res.json({
                status: 404,
                message: "message data not found"
            });
        }else{
            return res.json({
                status: 200,
                message: "Message was deleted successfully"
            });
        }

    }catch (error) {
        console.error('Error Deleting Message:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
        });
    }

});




//===== Routes for users=====

//===== Routes for user to send message to admin=====
router.post("/create-contact", verifyUser, async(req, res) => {
    try{

        const { subject, message } = req.body;
        const user = req.user.userId;
        
        if(!subject || !message){
            return res.json({
                status: 422,
                message: "All fields are required"
            });
        }

        if(subject.length < 2 || subject.length > 300){
            return res.json({
                status: 400,
                message: "Subject field has exceeded max value"
            });
        }

        const comment = new Message({
            userId: user,
            subject,
            message,
        });

        await comment.save();
        res.json({
            status: 200,
            message: "Sent..!! Check your email for replies"
        });

    }catch(error){
        console.error("Problem creating new message");
        return res.json({
            status: 500,
            message: "Internal Server Error"
        })
    }
});


//===== Routes to fetch comments by customers for chefs =====
router.get("/fetch-user-comment", verifyUser, async(req, res) => {

    const { page = 1, limit = 5} = req.query;

    const user = req.user.userId;

    const convert = new mongoose.Types.ObjectId(user);

    try{

        // Find ratings from comment document that matches logged user ID
        const comment = await Comment.find({ chefId: convert })
        .populate('recipeId', 'name')
        .sort({ _id: -1 })
        .limit(parseInt(limit))
        .skip((page - 1) * limit);
    

        // Count the total records that match the chefId filter
        const totalRecords = await Comment.countDocuments({chefId: convert});

        if(!comment || comment.length === 0){
            return res.json({
                status: 404,
                message: "Comments were not found"
            });
        }

        return res.json({
            status: 200,
            commentData: comment,
            totalRecords: totalRecords
        });

    }catch(error){
        console.error("Problem fetching comments");
        return res.json({
            status: 500,
            message: "Internal Server Error"
        })
    }
})






export {router as CommentRoutes}