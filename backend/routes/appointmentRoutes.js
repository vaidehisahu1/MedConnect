import express from "express";
import {
  addAppointment,
  getMyAppointments
} from "../controllers/appointmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addAppointment);
router.get("/myappointments", protect, getMyAppointments);

export default router;
