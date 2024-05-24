import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({

    fullname:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    chefId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    comment: {
        type: String,
    },
    recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recipes',
    },
    recipeSlug: {
        type: String,
    },
    catSlug: {
        type: String,
    },
    rating: {
        type: Number,
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
    }

});


const CommentModel = mongoose.model('comments', CommentSchema);
export {CommentModel as Comment}