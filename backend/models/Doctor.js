import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    fee: { type: Number, required: true },
    location: { type: String, required: true },
    image: {
      type: String,
      default: "https://via.placeholder.com/150"
    },
    about: { type: String, required: true },

    // New Fields for Enhanced Registration
    registrationNumber: { type: String },
    registrationCouncil: { type: String },
    registrationYear: { type: String },
    degree: { type: String },
    college: { type: String },
    completionYear: { type: String },
    experienceYear: { type: String }, // Start year of practice
    available: { type: Boolean, default: true },
    slots: {
      type: [String],
      default: []
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
