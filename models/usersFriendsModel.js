'use strict'
const mongoose = require("mongoose");

const usersFriendsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
},
    { timestamps: true }
);

const usersFriends = mongoose.model("usersFriends", usersFriendsSchema);
module.exports = usersFriends;