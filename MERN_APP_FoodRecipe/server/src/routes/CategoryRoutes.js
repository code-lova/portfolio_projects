import express from "express";
import jwt from "jsonwebtoken";
import { Category } from "../models/Category.js";

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

//Storing new categories
router.post("/store-category", verifyUser, async(req, res) => {
    try{
        const {
            name, 
            slug, 
            description, 
            status, 
            meta_title, 
            meta_keywords, 
            meta_description
        } = req.body;

        const category = await Category.findOne({name});

        if(!name || !slug || !description || !meta_title){
            return res.json({
                status: 404,
                message: "All fields are required"
            })
        }

        if(name.length < 2 || name.length > 50){
            return res.json({
                status: 400,
                message: "name is too long or short"
            })
        }

        if(slug.length < 2 || slug.length > 50){
            return res.json({
                status: 400,
                message: "Slug is too long or short"
            })
        }

        if(meta_keywords.length < 2 || meta_keywords.length > 100){
            return res.json({
                status: 400,
                message: "Meta keyword is too long or short"
            })
        }

        if(meta_description.length < 2){
            return res.json({
                status: 400,
                message: "Meta keyword is too long or short"
            })
        }

        if(category){
            return res.json({
                status: 409,
                message: 'Category already exist',
            })
        }

        //function to convert string to slug-string
        const stringToSlug = (str, separator = '-') => {
            return str
                .toLowerCase()
                .replace(/[^\w\s]/g, '') // Remove non-alphanumeric characters
                .trim()
                .replace(/\s+/g, separator);
        };
        
        // Assuming there is a name variable available
        const slugs = stringToSlug(slug);

        const newCategory = new Category({
            name, 
            slug: slugs,
            description, 
            status, 
            meta_title, 
            meta_keywords, 
            meta_description
        });

        await newCategory.save();
        return res.json({
            status: 200,
            message: 'New Recipe Category Created..'
        });

    }catch(error){
        console.log("Error: ", error.message);
        return res.json({
            status: 500,
            message: "Internal Server Error"
        })
    }
    

});

//fetching all categories
router.get("/fetchcategories", verifyUser, async(req, res) => {
    const { page = 1, limit = 5 } = req.query; // Default limit is set to 5

    try {
        const categories = await Category.find() // Retrieve all categories from the database
        .limit(parseInt(limit)) // Parse limit to integer
        .skip((page - 1) * limit); // Calculate skip based on page and limit

        const totalRecords = await Category.countDocuments(); // Count total records in the collection

        return res.json({
            status: 200,
            categories: categories,
            totalRecords: totalRecords
        })

    } catch (error) {
        console.error('Error fetching categories:', error);
        return res.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }

});


router.get("/editcategory/:id", verifyUser, async(req, res) => {
    try{

        const {id} = req.params;

        // Find the category by its ID
        const category = await Category.findById(id);

        // Check if category is found
        if (!category) {
            return res.json({
                status: 404,
                message: "Category not found"
            });
        }

        // Return the category details
        return res.json({
            status: 200,
            category: category
        });

    }catch(error){
        console.error("Error fetching category ID:", error);
        return res.json({
            status: 500,
            message: "Internal Server Error"
        })
    }
});


router.put("/updatecategory/:id", verifyUser, async(req, res) => {

    try{

        const {id} = req.params;

        // Destructure fields from the request body
        const {
            name, 
            slug, 
            description, 
            status, 
            meta_title, 
            meta_keywords, 
            meta_description
        } = req.body;


        if(!name || !slug || !description || !meta_title){
            return res.json({
                status: 422,
                message: "All fields are required"
            })
        }


         //function to convert string to slug-string
         const stringToSlug = (str, separator = '-') => {
            return str
                .toLowerCase()
                .replace(/[^\w\s]/g, '') // Remove non-alphanumeric characters
                .trim()
                .replace(/\s+/g, separator);
        };
        
        // Assuming there is a name variable available
        const slugs = stringToSlug(slug);

        // Construct update object with provided fields
        const updateCategory = {
            name,
            slug: slugs,
            description,
            status,
            meta_title,
            meta_keywords,
            meta_description
        };


        // Update category by ID 
        const updatedCategory = await Category.findByIdAndUpdate(id, updateCategory, {new: true});

        // Check if category was found and updated
        if (!updatedCategory) {
            return res.json({
                status: 404,
                message: "Category not found"
            });
        }else{
            return res.json({
                status: 200,
                message: "Category updated successfully"
            });

        }




    }catch(error){
        console.error('Error updating category:', error);
        return res.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
})

router.delete("/deletecategory/:id", verifyUser, async(req, res) => {
    try{

        const {id} = req.params;

        const deletedCategory = await Category.findByIdAndDelete(id);
    
        // Check if category is found and deleted
        if (!deletedCategory) {
            return res.json({
                status: 404,
                message: "Category not found"
            });
        }else{
            return res.json({
                status: 200,
                message: "Category deleted successfully"
            });
        }

    }catch (error) {
        console.error('Error deleting category:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
        });
    }

})


/////\\\\\\\\\===FRONT END PAGE ROUTES=====\\\\\\\////////

//fetching all categories for front-end page
router.get("/getcategories", async(req, res) => {

    try {
        const categories = await Category.find() // Retrieve all categories from the database

        return res.json({
            status: 200,
            categories: categories,
        })

    } catch (error) {
        console.error('Error fetching categories:', error);
        return res.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }

});




export {router as CategoryRoutes}