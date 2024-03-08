import User from "../models/user.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import mongoose from "mongoose"

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser && (await bcrypt.compare(password, existingUser.password))) {
            const token = jwt.sign({ userID: existingUser._id, email }, process.env.TOKEN_KEY, {
                expiresIn: "1 day"
            });
            existingUser.token = token;

            return res.status(200).send({
                "id": existingUser._id,
                "email": existingUser.email,
                "username": existingUser.username,
                "token": token,
                favoritePlaces: existingUser.favoritePlaces,
                profilePhoto: existingUser.profilePhoto
            });
        }

        return res.status(400).json({ err: "Wrong credentials. Please try again" });

    } catch (err) {
        console.log(err);
    }
}

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            return res.status(409).send({ err: "There is already an account using this email address." });
        }

        const encryptedPass = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: encryptedPass,
            profilePhoto: "img/defaultUser.png"
        });

        res.status(201).json(newUser);

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

const logout = async (req, res) => {
    try {

    } catch (err) {
        console.log(err);
        res.send("Error");
    }
}

const getUserData = async (req, res) => {
    User.findOne({ username: req.params.username }, (err, user) => {
        if (err) {
            console.log("Error in finding a user that has this username");
            return res.status(404).json({ err: "Finding error" });
        }

        return res.status(200).send({ id: user.id, username: user.username, profilePhoto: user.profilePhoto, favoritePlaces: user.favoritePlaces });
    });
}

const getUserDataById = async (req, res) => {

    User.findOne({ _id: req.params.userId }, (err, user) => {
        if (err) {
            console.log("Error in finding a user that has this username");
            return res.status(404).json({ err: "Finding error" });
        }

        return res.status(200).send({ id: user.id, username: user.username, profilePhoto: user.profilePhoto, favoritePlaces: user.favoritePlaces });
    });
}

const updateUser = async (req, res) => {
    console.log("Update user");

    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
        return res.status(422).send({ err: "User ID has an invalid format" });
    }

    const existingUser = await User.findById(req.params.userId);

    if (!existingUser) {
        return res.status(404).send("User not found");
    }

    for (let key of Object.keys(req.body)) {
        const jsonUser = JSON.parse(JSON.stringify(existingUser));
        if (jsonUser.hasOwnProperty(key)) {
            existingUser[key] = req.body[key];
        }
    }

    console.log("update user has existing User:");
    console.log(existingUser);

    existingUser.save((err, modifiedUser) => {
        if (err) {
            return res.status(409).send({ err: "Updating resource error" });
        }
        return res.status(200).send(modifiedUser);
    })
}

export {
    login,
    register,
    logout,
    getUserData,
    updateUser,
    getUserDataById
}



