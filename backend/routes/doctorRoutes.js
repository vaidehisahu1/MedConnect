import express from "express";
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorProfile,
  updateDoctorProfile,
  createSlot,
  getSlots,
  updateSlot,
  deleteSlot
} from "../controllers/doctorController.js";
import { authDoctor } from "../controllers/doctorAuthController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Doctor authentication routes
router.post("/login", authDoctor);

router.route("/")
  .get(getDoctors)
  .post(createDoctor);

router.route("/profile")
  .get(protect, getDoctorProfile)
  .put(protect, updateDoctorProfile);

// Slot management routes
router.post("/slots", protect, createSlot);
router.get("/slots", protect, getSlots);
router.put("/slots", protect, updateSlot);
router.delete("/slots", protect, deleteSlot);

router.route("/:id")
  .get(getDoctorById)
  .put(protect, admin, updateDoctor)
  .delete(deleteDoctor);

export default router;
