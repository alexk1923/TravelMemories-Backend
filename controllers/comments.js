import Comment from "../models/comment.js"

import mongoose from "mongoose";

const getAllCommentaries = async (req, res) => {
    try {
        let comments = [];
        if (req.query.placeId) {
            comments = await Comment.find({ "placeId": req.query.placeId });
            console.log("Comments by Place Id:");
            console.log(comments);
        } else {
            comments = await Comment.find({});
            console.log("All comments:");
            console.log(comments);
        }
        return res.status(200).send(comments);

    } catch (err) {
        return res.status(500).send({ "Error": err });
    }
}


const getCommentaryById = async (req, res) => {
    try {
        const comment = await Comment.findOne({ _id: req.params.commentId });
        if (!comment) {
            return res.status(404).send("The comment has not been found!");
        }
        return res.status(200).send({ comment });
    } catch (err) {
        return res.status(500).send(err);
    }
}


const addNewComment = async (req, res) => {
    try {
        console.log("BAi baiatule bai");
        console.log(req.body);

        const { placeId, commentId, commentMsg, datePosted, user } = req.body;
        const { userId, username, profilePhoto } = user;


        Comment.create({
            placeId,
            commentId,
            commentMsg,
            datePosted,
            user: {
                userId,
                username,
                profilePhoto
            }
        }, (err, newComment) => {
            if (err) {
                return res.status(500).send(err);
            }

            return res.status(201).send(newComment);
        });

    } catch (err) {
        return res.status(500).send(`Error in post new comment:${err}`)
    }
}

export {
    getAllCommentaries,
    getCommentaryById,
    addNewComment
}