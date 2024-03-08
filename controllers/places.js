import Place from "../models/place.js";
import User from "../models/user.js"

import mongoose from "mongoose";

const getAllPlaces = async (req, res) => {
    try {
        if (req.query.limit) {
            const places = await Place.aggregate([
                {
                    $set: { noVisitors: { $size: { "$ifNull": ["$visitors", []] } } }
                },
                {
                    $sort: { "noVisitors": -1 }
                },
                {
                    "$limit": Number(req.query.limit)
                },
                {
                    $unset: ["noVisitors"]
                }
            ]);

            return res.status(200).send(places);
        } else {
            const places = await Place.find({});
            return res.status(200).send(places);
        }


    } catch (err) {
        return res.status(500).send({ 'err': err });
    }
}


const deletePlaceByID = async (req, res) => {

    const existingPlace = await Place.findOne({ _id: req.params.placeID });
    if (!existingPlace) {
        return res.status(404).send("The place with this id doesn't exists");
    }

    if (req.authUserID.userID != existingPlace.addedBy) {
        return res.status(401).send("You are not allowed to delete this place");
    }

    existingPlace.remove();
    return res.status(200).send({ "deleted_id": req.params.placeID });
}

const addNewPlace = async (req, res) => {
    try {
        const place = await Place.findOne({ name: req.body.name });

        if (place) {
            return res.status(409).send("This places already exists");
        }

        const { name, city, country, imageURL } = req.body;
        console.log("my image url: " + imageURL);

        Place.create({
            name,
            country,
            city,
            imageURL,
            favorite: 0,
            likes: 0,
            visitors: [req.authUserID.userID],
            addedBy: req.authUserID.userID,
            liked: [],
            ratings: []
        }, (err, newPlace) => {
            if (err) {
                return res.status(500).send({ "err": err });
            }

            return res.status(201).send(newPlace);
        });

    } catch (err) {
        return res.status(500).send(`Error in post new place:${err}`)
    }
}

const updatePlace = async (req, res) => {
    console.log("Update place");

    if (!mongoose.Types.ObjectId.isValid(req.params.placeID)) {
        return res.status(422).send("Place ID has an invalid format");
    }

    const existingPlace = await Place.findById(req.params.placeID);

    if (!existingPlace) {
        return res.status(404).send("Place not found");
    }

    if (!req.body.unprivileged && req.authUserID.userID !== existingPlace.addedBy) {
        console.log(req.authUserID.userID + "vs." + existingPlace.addedBy);
        return res.status(401).send("You are not allowed to edit this place");
    }

    for (let key of Object.keys(req.body)) {
        const JSONPlace = JSON.parse(JSON.stringify(existingPlace));
        if (JSONPlace.hasOwnProperty(key)) {
            existingPlace[key] = req.body[key];
        }
    }

    existingPlace.save((err, modifiedPlace) => {
        if (err) {
            return res.status(409).send("Updating resource error");
        }
        return res.status(200).send(modifiedPlace);
    })
}

const getSinglePlaceByID = async (req, res) => {
    const place = await Place.findById(req.params.placeID);

    if (!mongoose.Types.ObjectId.isValid(req.params.placeID)) {
        return res.status(422).send("Place ID has an invalid format");
    }

    if (!place) {
        return res.status(404).send("Place with this ID doesn't exist");
    }

    return res.status(200).send(place);
}

const getPlacesByUser = async (req, res) => {
    console.log("Requested:");
    console.log(req.params);

    try {
        const foundUser = await User.findOne({ username: req.params.username });
        console.log(foundUser);

        if (foundUser) {
            console.log("found user id:");
            console.log(foundUser._id.toString());

            Place.find({ addedBy: foundUser._id.toString() }, (err, places) => {
                if (err) {
                    console.log("Error in finding places added by this user.");
                    return res.status(404).send("Finding error");
                }

                return res.status(200).send(places);
            });
        } else {
            return res.status(404).send("Finding error");
        }


    } catch (err) {
        console.log(`The user with username:${req.params.username} could not be found`);
        return res.status(404).send("Finding erorr");
    }
}

export {
    getAllPlaces,
    deletePlaceByID,
    addNewPlace,
    updatePlace,
    getSinglePlaceByID,
    getPlacesByUser
}