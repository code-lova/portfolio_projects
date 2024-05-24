import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        match: /^[a-zA-Z\s]*$/,
        minlength: 2,
        maxlength: 50
    },

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true //convert all email to lowercase
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    address: {
        type: [
            {
                street: { type: String, maxlength: 200 },
                city: { type: String, maxlength: 50 },
                country: { type: String, maxlength: 50}
            }
        ],
        default: []
    },
    role: {
        type: Number,
        default: 0,
        required: true,
        enum: [0, 1] // Only allow values 0 or 1 for user status
    },
    emailVarify: {
        type: Number,
        default: 0,
        required: true,
        enum: [0, 1]
    },
    status: {
        type: Number,
        default: 1,
        required: true,
        enum: [0, 1]
    },
    iPAddress: {
        type: String,
        default: "127.0.0.9"
    },
    otpCode: {
        type: String,
        minlength: 6, 
        maxlength: 6,
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
    description: {
        type: String,
        default: "Little about yourself"
    },
    isLoggedIn: {
        type: Boolean,
        default: false, // Default to false, set to true on login
    }

});

const UserModel = mongoose.model("users", UserSchema);
export {UserModel as User};