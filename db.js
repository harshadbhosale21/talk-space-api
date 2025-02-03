const mongoose = require("mongoose");
const { Mongo_Url } = require("./config.js");

const ConnectDB = async () => {
    try {
        await mongoose.connect(Mongo_Url);
        console.log("Database Connected Successfully");
    }
    catch (err) {
        console.log("Error Connecting Database", err)
    }
};

module.exports = ConnectDB;