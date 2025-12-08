import express from "express";
import {
  addAppointment,
  getMyAppointments,
  getDoctorAppointments,
  cancelAppointment,
  deleteAppointment
} from "../controllers/appointmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addAppointment);
router.get("/myappointments", protect, getMyAppointments);
router.get("/doctor-appointments", protect, getDoctorAppointments);
router.put("/:id/cancel", protect, cancelAppointment);
router.delete("/:id", protect, deleteAppointment);

export default router;
