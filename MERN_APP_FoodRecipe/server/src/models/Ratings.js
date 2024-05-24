import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({

    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments'
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


const RatingModel = mongoose.model('ratings', RatingSchema);
export {RatingModel as Ratings};