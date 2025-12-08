import express from "express";
import {
  addAppointment,
  getMyAppointments,
  getDoctorAppointments,
  cancelAppointment,
  deleteAppointment,
  acceptAppointment,
  rejectAppointment
} from "../controllers/appointmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addAppointment);
router.get("/myappointments", protect, getMyAppointments);
router.get("/doctor-appointments", protect, getDoctorAppointments);
router.put("/:id/cancel", protect, cancelAppointment);
router.put("/:id/accept", protect, acceptAppointment);
router.put("/:id/reject", protect, rejectAppointment);
router.delete("/:id", protect, deleteAppointment);

export default router;
