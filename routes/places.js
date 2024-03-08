import express from 'express';
const router = express.Router();
import { auth } from "../middlware/auth.js"
import {
    getAllPlaces, deletePlaceByID, addNewPlace, updatePlace,
    getSinglePlaceByID, getPlacesByUser
} from "../controllers/places.js";

router.get("/places/all", getAllPlaces);

router.get("/places/:placeID", getSinglePlaceByID);

router.delete("/places/:placeID", auth, deletePlaceByID);

router.post("/places", auth, addNewPlace);

router.patch("/places/:placeID", auth, updatePlace);

router.get("/user/:username/places", auth, getPlacesByUser);

export default router;

