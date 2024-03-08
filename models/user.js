import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePhoto: { type: String },
    token: { type: String },
    favoritePlaces: { type: [] }
})

export default mongoose.model("user", userSchema);