const { usersFriends } = require("../models/usersFriendsModel.js");

const userController = {};

userController.fetchAllMyConnections = async function (req, res) {
    try {
        const userId = req.uid;

        const userConnections = await usersFriends.findOne({ userId })
            .populate({
                path: "friends",
                select: "firstName lastName email userName mobileNo userRole gender profilePic"
            });

        if (!userConnections) {
            return res.status(206).json({ data: [] })
        }

        res.status(200).json({ data: userConnections.friends })
    }
    catch (err) {
        console.log("error fetching connections", err)
        res.status(500).json({
            error: "Internal Server error"
        })
    }
}