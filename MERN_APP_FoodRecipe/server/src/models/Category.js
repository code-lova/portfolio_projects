import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({

    name: {
        type: String,
        unique: true,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true, 
        trim: true, // Remove whitespace from both ends of the string
        minlength: 3, 
        maxlength: 50,
    },
    description: {
        type: String,
        required: true, // Makes the field mandatory
        minlength: 10, 
        maxlength: 200,
    },
    status: {
        type: Number,
        default: 0,
    },
    meta_title: {
        type: String,
        maxlength: 100,
    },
    meta_keywords: {
        type: String,
    },
    meta_description: {
        type: String
    }

});

const CategoryModel = mongoose.model('category', CategorySchema);
export {CategoryModel as Category};