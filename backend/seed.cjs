const mongoose = require("mongoose");
const Doctor = require("./models/Doctor.js").default;

mongoose.connect("mongodb://127.0.0.1:27017/medconnect")
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.log(err));

async function seed() {

  await Doctor.create({
    name: "Dr. John Doe",
    specialization: "General Physician",
    experience: 10,
    fee: 500,
    location: "Mumbai",
    image: "https://via.placeholder.com/150",
    about: "Experienced general physician",
    slots: ["09:00", "10:00"],
    available: true
  });

  console.log("Seed complete");
  mongoose.connection.close();
}

seed();
