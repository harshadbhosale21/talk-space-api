const User = require("../models/userModel.js");
const Conversation = require("../models/conversationModel.js");
const Message = require("../models/messageModel.js");
const usersFriends = require("../models/usersFriendsModel.js");
const { io } = require("../socket/socket.io.js")
const getReceiverSocketId = require("../socket/socket.io.js")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
    SECRET_KEY_USER
} = require("../config.js")

const publicController = {};

publicController.registerUser = async function (req, res) {
    try {
        const { firstName, lastName, email, userName, password, gender, userRole } = req.body;

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Set profile picture based on gender
        let profilePic = (gender === 'male')
            ? '../public/images/avatars/male.png'
            : (gender === 'female')
                ? '../public/images/avatars/female.png'
                : '../public/images/avatars/male.png';

        // Create new user
        const newUser = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password: hashedPassword,
            gender,
            userRole,
            profilePic
        });

        const senderId = '6794b09f645274ee71adeb16';
        const receiverId = newUser._id;

        const message = `Hello and Welcome <strong>${firstName} ${lastName}</strong> to TalkSpace.<br><br>
                         I am <b>Harshad Bhosale</b>, the creator of TalkSpace, and I am <i>excited</i> to have you here.<br><br>
                         Please explore our platform, go ahead and find new connections to start your conversation with.`;

        // Create conversation and message
        let conversation = await Conversation.create({ participants: [senderId, receiverId] });

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        });

        conversation.messages.push(newMessage._id);

        // Create friendship connections
        const newUserFriendConnection = new usersFriends({
            userId: receiverId,
            friends: [senderId]
        });

        const adminFriendConnection = new usersFriends({
            userId: senderId,
            friends: [receiverId]
        });

        await Promise.all([
            conversation.save(),
            newMessage.save(),
            newUserFriendConnection.save(),
            adminFriendConnection.save()
        ]);

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage) //sending to specefic client
        } else {
            console.log('Socket Id not found - ', receiverId)
        }

        return res.status(201).json({ message: "User Created Successfully" });
    }
    catch (err) {
        console.log("Error", err)
    }
};

publicController.loginUser = async function (req, res) {
    try {
        const { email, password } = req.body;
        const userObj = await User.findOne({
            email: email
        });
        if (!userObj) {
            return res.status(400).json({ error: "Incorrect email or password" })
        };
        const isCorrectPassword = await bcrypt.compare(password, userObj.password);
        if (!isCorrectPassword) {
            return res.status(500).json({ error: 'Incorrect email or password' })
        }
        else {
            const payload = {
                uid: userObj._id,
                firstName: userObj.firstName,
                lastName: userObj.lastName
            }
            const token = jwt.sign(payload, SECRET_KEY_USER, {
                expiresIn: '12h'
            })
            const cookieOptions = {
                maxAge: 43200000,
                httpOnly: true
            }
            res.cookie('talkspace_auth_token', token, cookieOptions).sendStatus(200)
        }
    }
    catch (err) {
        console.log("Error Logging in", err)
    }
};

publicController.logoutUser = async function (req, res) {
    try {
        // res.clearCookie('talkspace_auth_token', {
        //     httpOnly: true
        // })
        res.cookie('talkspace_auth_token', "", { maxAge: 0 })
        res.status(200).send("User logout")
    }
    catch (err) {
        console.log("Error logging out", err)
    }
}


module.exports = publicController;