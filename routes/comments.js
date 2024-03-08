import { getAllCommentaries, getCommentaryById, addNewComment } from "../controllers/comments.js";
import { auth } from "../middlware/auth.js"
import express from "express"

const router = express.Router();

router.get("/comments/", auth, getAllCommentaries);
router.get("/comments/:commentId", auth, getCommentaryById);
router.post("/comments/", auth, addNewComment);


export default router;