'use strict'
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    mobileNo: {
        type: String,
        unique: false,
        trim: true,
        allowNull: true
    },
    password: {
        type: String,
        required: true,
        minlenght: 6
    },
    gender: {
        type: String,
        required: false,
        enum: ["male", 'female']
    },
    userRole: {
        type: String,
        required: true,
        enum: ['admin', 'user']
    },
    profilePic: {
        type: String,
        default: " ",
    }
},
    { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;