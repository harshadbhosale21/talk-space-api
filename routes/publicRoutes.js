const express = require("express");
const publicController = require("../controllers/publicController.js");
const router = express.Router();

router.route("/registerUser")
    .post(publicController.registerUser);

router.route("/loginUser")
    .post(publicController.loginUser);

router.route("/logoutUser")
    .post(publicController.logoutUser)


module.exports = router;