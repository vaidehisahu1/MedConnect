import express from "express";
import { registerUser, authUser } from "../controllers/authController.js";
import { registerDoctor } from "../controllers/doctorAuthController.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", authUser);
router.post("/doctor/signup", registerDoctor);

export default router;
