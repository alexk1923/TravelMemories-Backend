import dotenv from "dotenv"
dotenv.config()

import express, { json } from "express"
import { connect } from "mongoose"
import placesRoutes from "./routes/places.js"
import usersRoutes from "./routes/users.js"
import commentRoutes from "./routes/comments.js"
import authenticationRoutes from "./routes/authentication.js"
import cors from "cors"
import { auth } from "./middlware/auth.js";

const PORT = process.env.PORT || 8000;


const app = express();
app.use(json());
app.use(cors());
app.use("/api/", placesRoutes);
app.use("/api/", usersRoutes);
app.use("/api/", commentRoutes)
app.use("/", authenticationRoutes);


connect("mongodb+srv://alexk1923:travel-memories-alexk1923@travel-memories.a8qhq46.mongodb.net/travelMemoriesUsersDB").then(() => {
    app.listen(PORT, () => {
        console.log("Connected to the database and started server on port: " + PORT);
    })
}).catch((err) => {
    console.log(err);
});



app.get("/homepage", auth, (req, res) => {
    res.status(200).send("Authenticated !");
})
