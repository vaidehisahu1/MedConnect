import Appointment from "../models/Appointment.js";

export const addAppointment = async (req, res) => {
  const { doctor, date, time } = req.body;

  try {
    const appointment = new Appointment({
      user: req.user._id,
      doctor,
      date,
      time,
    });

    const createdAppointment = await appointment.save();
    res.status(201).json(createdAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// For Patients
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      user: req.user._id,
    }).populate("doctor", "name specialization image location");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// For Doctors
export const getDoctorAppointments = async (req, res) => {
  try {
    // First find the doctor profile associated with this user
    const Doctor = (await import("../models/Doctor.js")).default;
    const doctorProfile = await Doctor.findOne({ user: req.user._id });

    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const appointments = await Appointment.find({
      doctor: doctorProfile._id,
    }).populate("user", "name email");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Verify user owns the appointment
    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json({ message: "Appointment cancelled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await appointment.deleteOne();
    res.json({ message: "Appointment removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
