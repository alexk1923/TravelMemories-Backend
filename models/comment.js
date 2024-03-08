import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    placeId: { type: String, required: true },
    commentMsg: { type: String, required: true },
    datePosted: { type: Date, required: true },
    user: {
        userId: { type: String, required: true },
        username: { type: String, required: true },
        profilePhoto: { type: String, required: true }
    }
})

export default mongoose.model("comment", commentSchema);