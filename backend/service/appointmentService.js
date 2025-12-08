import Appointment from "../models/Appointment.js";

export const createAppointment = async (data) => {
  return await Appointment.create(data);
};

export const findAppointmentsByUser = async (userId) => {
  return await Appointment.find({ user: userId })
    .populate("doctor", "name specialization image location");
};
