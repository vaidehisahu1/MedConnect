import User from "../models/User.js";

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const createUser = async (name, email, password) => {
  return await User.create({ name, email, password });
};
