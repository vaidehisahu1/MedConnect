import express from "express";
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorProfile,
  updateDoctorProfile
} from "../controllers/doctorController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getDoctors)
  .post(createDoctor);

router.route("/profile")
  .get(protect, getDoctorProfile)
  .put(protect, updateDoctorProfile);

router.route("/:id")
  .get(getDoctorById)
  .put(protect, admin, updateDoctor)
  .delete(deleteDoctor);

export default router;
