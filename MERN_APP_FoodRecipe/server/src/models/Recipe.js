import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        maxlength: 200,
        unique: true,
        match: /^[a-zA-Z\s]*$/,
        minlength: 2,
    },
    slug: {
        type: String,
        required: true,
        unique: true, 
        trim: true, // Remove whitespace from both ends of the string
        minlength: 3, 
        maxlength: 200,
    },
    catSlug: {
        type: String,
    },
    ratings: {
        type: Number,
        default: 0
    },
    comment_count: {
        type: Number,
        default: 0
    },
    file: {
        type: String,
    },
    short_des: {
        type: String,
    },
    status:{
        type: Number,
        default: 0
    },
    active_time: {
        type: Number,
    },
    total_time: {
        type: Number
    },
    cooking_steps: {
        type: [String], // Adjusted to define cooking steps as an array of strings
        default: [],
    },
    ingredients: {
        type: [String], // Adjusted to define ingredients as an array of strings
        default: [],
    },
    meta_title: {
        type: String,
        maxlength: 100,
    },
    meta_keywords: {
        type: String,
    },
    meta_desc: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Change to ObjectId type
        ref: 'users' // Reference to User model 
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true
    },

});

const RecipeModel = mongoose.model("recipes", RecipeSchema);
export {RecipeModel as Recipes};