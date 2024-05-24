import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/Users.js";



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


router.get("/fetchchefs", verifyUser, async(req, res) => {
    const { page = 1, limit = 5 } = req.query; // Default limit is set to 5

    try{

        const chefs = await User.find({role: 0}) // Retrieve all categories from the database
        .sort({_id: -1})
        .limit(parseInt(limit)) // Parse limit to integer
        .skip((page - 1) * limit); // Calculate skip based on page and limit

        const totalRecords = await User.countDocuments({role: 0}); // Count total records in the collection

        return res.json({
            status: 200,
            chefs: chefs,
            totalRecords: totalRecords
        })


    }catch(error){
        console.error("Unable to fetch chefs", error);
        return res.json({
            status: 500,
            messahe: "Internal server error"
        })
    }
});

router.get("/editchef/:id", verifyUser, async(req, res) => {
    try{

        const {id} = req.params;

        const user = await User.findById(id);

        if(!user){
            return res.json({
                status: 404,
                messahe: "Chef's ID was not found"
            });
        }else{
            res.json({
                status: 200,
                userData: user
            });
        }

    }catch(error){
        console.error("Error fetching Chef's ID", error)
        return res.json({
            status: 500,
            messahe: "Internal server error"
        })
    }
});

//Updating this was casue we have sett address field to collect array of data
router.put("/updatechef/:id", verifyUser, async(req, res) => {
    try{
        const {id} = req.params;

        const {  // Destructure fields from the request body
            name, 
            email, 
            username, 
            status,
            street,
            city,
            country, 
            description
        } = req.body;

        const user = await User.findById(id);
        
         if (!user) {   // Check if category was found and updated
            return res.json({
                status: 404,
                message: "Chef was not found"
            });
        }

        user.name = name;
        user.email = email;
        user.username = username;
        user.status = status;
        user.description = description;

        // Update user's address if provided
        if (street || city || country) {
            const addressToUpdate = user.address.length > 0 ? user.address[0] : {};
            if (street) addressToUpdate.street = street;
            if (city) addressToUpdate.city = city;
            if (country) addressToUpdate.country = country;
            user.address = [addressToUpdate];
        }
       
        await user.save();
        return res.json({
            status: 200,
            message: "Chef updated successfully"
        });
        


    }catch(error){
        console.error("Error Updating Chef's ID", error)
        return res.json({
            status: 500,
            messahe: "Internal server error"
        })
    }


});

router.delete("/delete-chef/:id", verifyUser, async(req, res) => {
    try{

        const {id} = req.params;

        const deletedUser = await User.findByIdAndDelete(id);
    
        // Check if User is found and deleted
        if (!deletedUser) {
            return res.json({
                status: 404,
                message: "Chef not found"
            });
        }else{
            return res.json({
                status: 200,
                message: "Chef deleted successfully"
            });
        }

    }catch (error) {
        console.error('Error deleting Chef:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
})



export {router as ChefRoutes};