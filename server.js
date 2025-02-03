//Basic Imports
const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser")
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const ConnectDB = require("./db.js");
const jwt = require("jsonwebtoken");
const { app, server } = require("./socket/socket.io.js")
const {
    Mongo_Url,
    PORT
} = require("./config.js");

//middlewares imports
const withUserAuth = require("./userMiddleWare.js");

//Routes import
const publicRoutes = require("./routes/publicRoutes.js");

ConnectDB()

// const app = express();

//middlewares
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb', parameterLimit: 50000 }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(cookieParser())
app.use(helmet());

app.get('/api/checkUserToken', withUserAuth, function (req, res) {
    res.json({ id: req.uid }).status(200)
})

//Routes setup
app.use("/api/publicApi", publicRoutes);


//Port setup
server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})

