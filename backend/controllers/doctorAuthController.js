import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import generateToken from "../utils/generateToken.js";

export const registerDoctor = async (req, res) => {
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
};
