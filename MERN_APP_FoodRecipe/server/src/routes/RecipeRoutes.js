import express from "express";
import jwt from "jsonwebtoken";
import { Category } from "../models/Category.js";
import { Recipes } from "../models/Recipe.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs"
import { User } from "../models/Users.js";
import { Comment } from "../models/Comments.js";
import { Ratings } from "../models/Ratings.js";
import mongoose from "mongoose";

const router = express.Router();

// Get the directory name equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../uploads');


// Multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, uploadDir); // Specify the destination folder where images will be saved
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    
    fileFilter: function(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)){
            return cb(new Error('Only image files are allowed'));
        }
        cb(null, true);
    }
}).single('file');


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







//***********\\\\\\////// WHERE ADMIN RECIPES API ROUTES BEGINS ***********//////\\\\\\\\\

router.get("/show-admin-all-recipe", verifyUser, async(req, res) => {
    const { page = 1, limit = 6 } = req.query; // Default limit is set to 8

    try{

        const recipes = await Recipes.find()
        .sort({_id: -1})
        .limit(parseInt(limit)) // Parse limit to integer
        .skip((page - 1) * limit); // Calculate skip based on page and limit


        const totalRecords = await Recipes.countDocuments(); // Count total records in the collection

        if (!recipes || recipes.length === 0) {
            return res.json({
                status: 404,
                message: 'No recipes found for this user',
            });
        }
        
        return res.json({
            status: 200,
            recipeDatas: recipes,
            totalRecords: totalRecords
        });
        

    }catch(error){
        console.error('Error fetching recipes:', error);
        return res.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
});




router.get("/get-admin-recipe/:slugs", verifyUser, async(req, res) => {
    try{
        const {slugs} = req.params;
        const recipes = await Recipes.findOne({slug: slugs})

        if(!recipes && recipes.length === 0){
            return res.json({
                status: 404,
                message: 'Recipes Not found',
            });
        }
        return res.json({
            status: 200,
            adminData: recipes,
        });
    }catch(error){
        console.error("Problem fetching specific recipe:", error);
        return res.json({
            status: 500,
            message: "Internal Server Error"
        })
    }
})




//***********\\\\\\////// WHERE USER API ROUTES BEGINS ***********//////\\\\\\\\\

router.get("/get-categories", verifyUser, async(req, res) => {

    try{

        const categoryData = await Category.find({status: 1});
        return res.json({
            status: 200,
            catData: categoryData
        });

    }catch(error){
        console.error('Error fetching categories:', error);
        return res.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }

});

router.post("/storerecipes", upload, verifyUser, async(req, res) => {
    try{

        const {
            name,
            slug,
            catSlug,
            short_des,
            status,
            active_time,
            total_time,
            meta_title,
            meta_keywords,
            meta_desc,
            cooking_steps,
            ingredients
        } = req.body;

        const getRecipeByName = await Recipes.findOne({ name: name });
        const getRecipeBySlug = await Recipes.findOne({ slug: slug });
        
        if (getRecipeByName) {
            return res.json({ 
                status: 404,
                message: 'Recipe with this name already exists'
            });
        }
        
        if (getRecipeBySlug) {
            return res.json({ 
                status: 404,
                message: 'Recipe with this slug already exists'
            });
        }
      
        const imageName = req.file.filename;

        //Fetching user id from cookier header in verifyUser middleware
        const user = req.user;
        const userID = user.userId;

        if (!req.file) {
            return res.json({ 
                status: 404,
                message: 'No file uploaded'
            });
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

        const newRecipe = new Recipes({ 
            name, 
            slug: slugs, 
            catSlug,
            short_des,
            status,
            active_time,
            total_time,
            meta_title,
            meta_keywords,
            meta_desc,
            cooking_steps,
            ingredients,
            file: imageName,
            userId: userID
        });
        await newRecipe.save();
        return res.json({
            status: 200,
            message: "New Recipe Created Successfully"
        });

        
    }catch(error){
        console.error('Error saving recipies:', error);
        return res.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
});

router.get("/show-user-recipe", verifyUser, async(req, res) => {
    const { page = 1, limit = 8 } = req.query; // Default limit is set to 8

    try{
        
        //Fetching user id from cookier header in verifyUser middleware
        const user = req.user;
        const userID = user.userId;

        const recipes = await Recipes.find({ userId: userID, status: 1 })
        .limit(parseInt(limit)) // Parse limit to integer
        .skip((page - 1) * limit); // Calculate skip based on page and limit


        const totalRecords = await Recipes.countDocuments({ userId: userID, status: 1 }); // Count total records in the collection

        if (!recipes || recipes.length === 0) {
            return res.json({
                status: 404,
                message: 'No recipes found for this user',
            });
        }
        
        return res.json({
            status: 200,
            userData: recipes,
            totalRecords: totalRecords
        });
        

    }catch(error){
        console.error('Error fetching recipes:', error);
        return res.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }

});

router.get("/get-user-recipe/:slugs", verifyUser, async(req, res) => {
    try{
        const {slugs} = req.params;
        const recipes = await Recipes.findOne({slug: slugs})

        if(!recipes && recipes.length === 0){
            return res.json({
                status: 404,
                message: 'Recipes Not found',
            });
        }
        return res.json({
            status: 200,
            userData: recipes,
        });
    }catch(error){
        console.error("Problem fetching specific recipe:", error);
        return res.json({
            status: 500,
            message: "Internal Server Error"
        })
    }
});


router.put("/update-user-recipe/:slugs", upload, verifyUser, async(req, res) => {
    try{

        const {slugs} = req.params;

        const {
            name,
            categoryId,
            short_des,
            status,
            active_time,
            total_time,
            meta_title,
            meta_keywords,
            meta_desc,
            cooking_steps,
            ingredients
        } = req.body;

        const recipe = await Recipes.findOne({slug: slugs});

        if(!recipe){
            return res.json({
                status: 404,
                message: 'Recipes Not found',
            });
        }

        // Update the recipe data
        recipe.name = name;
        recipe.categoryId = categoryId;
        recipe.short_des = short_des;
        recipe.status = status;
        recipe.active_time = active_time;
        recipe.total_time = total_time;
        recipe.cooking_steps = JSON.parse(cooking_steps); // Parse cooking_steps from JSON string
        recipe.ingredients = JSON.parse(ingredients); // Parse ingredients from JSON string
        recipe.meta_title = meta_title;
        recipe.meta_keywords = meta_keywords;
        recipe.meta_desc = meta_desc;
        recipe.updatedAt = Date.now();

        if (req.file) {
            // Delete the old file if it exists
            if (recipe.file) {
                const oldFilePath = path.join(__dirname, '../uploads', recipe.file);
                fs.unlink(oldFilePath, (err) => {
                    if (err) {
                        console.error('Error deleting old file:', err);
                    }
                });
            }

            // Update the recipe image path with the new file
            recipe.file = req.file.filename;
        }

        // Save the updated recipe data to the database
        await recipe.save();

        return res.status(200).json({ status: 200, message: "Recipe updated successfully", updatedRecipe: recipe });



    }catch(error){
        console.error("Problem updating user recipe:", error);
        return res.json({
            status: 500,
            message: "Internal Server Error"
        })
    }

});


router.delete("/delete-user-recipe/:id", verifyUser, async(req, res) => {

    try{

        const {id} = req.params;

        const delUserRecipe = await Recipes.findByIdAndDelete(id);
    
        // Check if user recipe is found and deleted
        if (!delUserRecipe) {
            return res.json({
                status: 404,
                message: "Recipe Not Found"
            });
        }

       
        // Delete the associated file if it exists
        if (delUserRecipe.file) {
            const imageFilePath = path.join(__dirname, '../uploads', delUserRecipe.file);
            fs.unlink(imageFilePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });
        }
        

        // Respond with success message
         return res.json({
            status: 200,
            message: "Recipe Deleted Successfully"
        });
        

    }catch (error) {
        console.error('Error deleting category:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
        });
    }

});










//***********\\\\\\////// WHERE FRONTEND API ROUTES BEGINS ***********//////\\\\\\\\\

router.get("/show-all-recipe", async(req, res) => {
    try{

        const { page = 1, limit = 6, sort = 'latest', search = '' } = req.query; // Default limit is set to 8

        function getSortOption(sort) {
            switch (sort) {
                case 'latest':
                    return { createdAt: -1 };
                case 'top-rated':
                    return { ratings: -1 };
                case 'trending':
                    return { comment_count: -1 };
                default:
                    return { createdAt: -1 };
            }
        }

        const sortOption = getSortOption(sort);

       // Create a search query object
       const searchQuery = search 
       ? { name: { $regex: search, $options: 'i' } } 
       : {};

        const recipes = await Recipes.find({ status: 1, ...searchQuery })
        .populate('userId', 'name') // Populating userId with the name field from the User document
        .sort(sortOption) //Sort recipe according to latest or trending
        .limit(parseInt(limit)) // Parse limit to integer
        .skip((page - 1) * limit); // Calculate skip based on page and limit 

        // Count total records in the collection where status is active(1)
        const totalRecords = await Recipes.countDocuments({ status: 1, ...searchQuery }); 
        if (!recipes || recipes.length === 0) {
            return res.json({
                status: 404,
                message: 'No recipes found',
            });
        }
        
        return res.json({
            status: 200,
            userData: recipes,
            totalRecords: totalRecords
        });
        

    }catch(error){
        console.error('Error fetching recipes:', error);
        return res.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
    
});


router.get("/search-recipe", async(req, res) => {
    try{

        const { page = 1, limit = 20, sort = 'latest', search = '' } = req.query; // Default limit is set to 8

        function getSortOption(sort) {
            switch (sort) {
                case 'latest':
                    return { createdAt: -1 };
                case 'top-rated':
                    return { ratings: -1 };
                case 'trending':
                    return { comment_count: -1 };
                default:
                    return { createdAt: -1 };
            }
        }

        const sortOption = getSortOption(sort);

       // Create a search query object
       const searchQuery = search 
       ? { name: { $regex: search, $options: 'i' } } 
       : {};

        const recipes = await Recipes.find({ status: 1, ...searchQuery })
        .populate('userId', 'name') // Populating userId with the name field from the User document
        .sort(sortOption) //Sort recipe according to latest or trending
        .limit(parseInt(limit)) // Parse limit to integer
        .skip((page - 1) * limit); // Calculate skip based on page and limit 

        // Count total records in the collection where status is active(1)
        const totalRecords = await Recipes.countDocuments({ status: 1, ...searchQuery }); 
        if (!recipes || recipes.length === 0) {
            return res.json({
                status: 404,
                message: 'No recipes found',
            });
        }
        
        return res.json({
            status: 200,
            userData: recipes,
            totalRecords: totalRecords
        });
        

    }catch(error){
        console.error('Error fetching recipes:', error);
        return res.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
    
});


router.get("/get-recipe/:slug", async(req, res) => {
    try{

        const { slug } = req.params;

        const recipe = await Recipes.findOne({slug: slug}).populate('userId', 'name email');

        // Count the number of recipes created by the user
        const chefRecipeCount = await Recipes.countDocuments({ userId: recipe.userId });

        if(!recipe){
            return res.json({
                status: 404,
                message: 'Recipes Not found',
            }); 
        }
        return res.json({
            status: 200,
            recipeData: recipe,
            chefRecipeCount: chefRecipeCount,
        });

        
    }catch(error){
        console.error('Error fetching recipe:', error);
    }

});


router.get("/get-other-recipies", async(req, res) => {
    try{

        const recipes = await Recipes.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .populate('userId', 'name');

         // If no recipes are found, return a 404 error
         if (!recipes || recipes.length === 0) {
            return res.json({
                status: 404,
                message: 'No recipes found',
            });
        }

        // Return the found recipes
        return res.json({
            status: 200,
            otherRecipeData: recipes,
        });


    }catch(error){
        console.error('Internal server error:', error);
    }

});


router.post("/store-comment", async(req, res) => {
    try{

        const {fullname, rating, comment, recipeId, recipeSlug, catSlug, chefId} = req.body;

        if(!fullname || !comment) {
            return res.json({
                status: 422,
                message: "All fields are required"
            })
        }

        if(!rating){
            return res.json({
                status: 422,
                message: "Please provide a star rating"
            })
        }

        const newCommet = new Comment({
            fullname,
            rating,
            comment,
            recipeId,
            recipeSlug,
            catSlug,
            chefId

        });

        const savedComment = await newCommet.save();

        const CountRecipeComment = await Comment.find().countDocuments({ recipeSlug: recipeSlug });

        // if(CountRecipeComment > 0){
        //     console.log("You have a Recipe comment count of", CountRecipeComment)
        // }

        const ratingsCount = await Comment.find({ recipeSlug: recipeSlug });

        // if(ratingsCount === 0){
        //     console.log(" cannot find comment")
        // }

        //sum up the rating fields in respect to the recipe slug found
        const totalRating = ratingsCount.reduce((sum, comment) => sum + (comment.rating || 0), 0);

        const finalRating = totalRating / 2;

        // console.log(`Total rating for recipe ${recipeSlug}: ${finalRating}`);


        //Update the recipe document with the new rating for that recipe
        const findRecipe = await Recipes.findOne({ slug: recipeSlug });

        // if(!findRecipe){
        //     console.log("No recipe found with that slug")
        // }else{
        //     console.log("one recipe found");
        // }

        findRecipe.ratings = finalRating;
        findRecipe.comment_count = CountRecipeComment;

        await findRecipe.save();

        
        // Create a new star rating associated with the comment
        const newStarRating = new Ratings({
            commentId: savedComment._id
        });

        await newStarRating.save();

        return res.json({
            status: 200,
            message: "New Comment Created...",
            commentData: newCommet // Return the new comment data
        })

        
    }catch(error){
        console.error('Error fetching recipe:', error);
        return res.json({
            status: 500,
            message: "Internal Server Error"
        })
    }

});



router.get("/show-comments/:slug", async(req, res) => {

    try{

        const {slug} = req.params;

        const comments = await Comment.find({ recipeSlug: slug})
        .sort({createdAt: -1});

        return res.json({
            commentData: comments
        });

    }catch(error){
        console.error('Error fetching recipe:', error);
        return res.json({
            status: 500,
            message: "Internal Server Error"
        })
    }
});

router.get("/sort-recipe-category/:slug", async(req, res) => {

    try{

        const {slug} = req.params;
        const {sort} = req.query;

        let sortOption;

        switch (sort) {
            case 'latest':
                sortOption = { createdAt: -1 };
                break;
            case 'top-rated':
                sortOption = { ratings: -1 };
                break;
            case 'trending':
                    sortOption = { comment_count: -1 };
                    break;
            default:
                    sortOption = { createdAt: -1 };
        }

        const recipes = await Recipes.find({ catSlug: slug})
        .populate('userId', 'name')
        .sort(sortOption);

        if(!recipes || recipes.length === 0){
            return res.json({
                status: 404,
                message: "No recipe for this caregory",
            })
        }
        return res.json({
            status: 200,
            sortedData: recipes,
        });

    }catch(error){
        console.error('Error fetching recipe:', error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        })
    }
});


export {router as RecipeRoutes};