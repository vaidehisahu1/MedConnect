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
