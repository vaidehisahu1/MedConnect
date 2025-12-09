import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import generateToken from "../utils/generateToken.js";

export const registerDoctor = async (req, res) => {
  try {
    const {
      name, email, password, specialization, experience, fee, location, about,
      registrationNumber, registrationCouncil, registrationYear,
      degree, college, completionYear, experienceYear
    } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Doctor already exists" });

    const user = await User.create({
      name,
      email,
      password,
      role: "doctor"
    });

    try {
      const doctor = await Doctor.create({
        user: user._id,
        name,
        specialization,
        experience,
        fee,
        location,
        about,
        registrationNumber,
        registrationCouncil,
        registrationYear,
        degree,
        college,
        completionYear,
        experienceYear,
        slots: [],
      });

      res.status(201).json({
        _id: user._id,
        name,
        email,
        role: user.role,
        doctorId: doctor._id,
        token: generateToken(user._id),
      });
    } catch (docError) {
      // Rollback: Delete the user if doctor creation fails
      await User.findByIdAndDelete(user._id);
      throw new Error("Failed to create doctor profile: " + docError.message);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to register doctor" });
  }
};

export const authDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if user is a doctor
    if (user.role !== "doctor") {
      return res.status(403).json({ message: "Access denied. Doctor account required." });
    }

    // Verify password
    if (await user.matchPassword(password)) {
      // Find the doctor profile
      const doctor = await Doctor.findOne({ user: user._id });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        doctorId: doctor ? doctor._id : null,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to login" });
  }
};
