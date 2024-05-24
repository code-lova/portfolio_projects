import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    subject: {
        type: String,
        minlength: 2,
        maxlenght: 300,
        required: true
    },
    message: {
        type: String,
        minlength: 2,
        maxlenght: 1000,
        required: true
    }

});


const MessageModel =  mongoose.model('messages', MessageSchema);
export {MessageModel as Message};