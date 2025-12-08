import Doctor from "../models/Doctor.js";

export const getDoctors = async (req, res) => {
  const doctors = await Doctor.find();
  res.json(doctors);
};

export const getDoctorById = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  doctor ? res.json(doctor) : res.status(404).json({ message: "Not found" });
};

export const createDoctor = async (req, res) => {
  const doctor = await Doctor.create(req.body);
  res.status(201).json(doctor);
};

export const updateDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });

  Object.assign(doctor, req.body);
  res.json(await doctor.save());
};

export const deleteDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });

  await doctor.deleteOne();
  res.json({ message: "Doctor deleted" });
};

// For Doctor Dashboard
export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

    // Allow updating limited fields for now (availability, slots, fees, etc.)
    const { slots, available, fee, experience, about } = req.body;

    if (slots) doctor.slots = slots;
    if (available !== undefined) doctor.available = available;
    if (fee) doctor.fee = fee;
    if (experience) doctor.experience = experience;
    if (about) doctor.about = about;

    await doctor.save();
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
