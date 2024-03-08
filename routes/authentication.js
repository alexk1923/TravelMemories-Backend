import { login, register, logout } from "../controllers/user.js"
import express from "express"
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

export default router;