import Doctor from "../models/Doctor.js";

export const getAllDoctors = async () => {
  return await Doctor.find();
};

export const createDoctorService = async (data) => {
  return await Doctor.create(data);
};
