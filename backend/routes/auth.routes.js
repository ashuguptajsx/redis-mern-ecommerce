import express from "express";
import { login, signup, logout } from "../controllers/auth.controllers.js";
import { refreshToken } from "../controllers/auth.controllers.js";
import { getProfile } from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/refresh-token", refreshToken);

router.get("/profile", protectRoute, getProfile)

export default router;
