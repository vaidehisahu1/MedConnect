import mongoose from "mongoose";
import dotenv from "dotenv";
import Doctor from "./models/Doctor.js";

dotenv.config();

const specializations = [
    "General Physician",
    "Pediatrician",
    "Orthopedic Surgeon",
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Gynecologist",
    "Psychiatrist"
];

const cities = [
    "Delhi",
    "Mumbai",
    "Bengaluru",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Ahmedabad"
];

const firstNames = ["Dr. Aarav", "Dr. Vivaan", "Dr. Aditya", "Dr. Vihaan", "Dr. Arjun", "Dr. Sai", "Dr. Reyansh", "Dr. Ayan", "Dr. Krishna", "Dr. Ishaan", "Dr. Diya", "Dr. Saanvi", "Dr. Ananya", "Dr. Aadhya", "Dr. Pari", "Dr. Kiara", "Dr. Myra", "Dr. Riya", "Dr. Anvi", "Dr. Pihu"];
const lastNames = ["Sharma", "Verma", "Gupta", "Malhotra", "Bhatia", "Saxena", "Mehta", "Chopra", "Deshmukh", "Joshi", "Patel", "Reddy", "Nair", "Iyer", "Rao", "More", "Kulkarni", "Singh", "Yadav", "Das"];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateDoctors = (count) => {
    const doctors = [];
    for (let i = 0; i < count; i++) {
        const specialization = getRandomItem(specializations);
        const city = getRandomItem(cities);
        const name = `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`;

        // Cycle through images doc1-doc6
        const image = `doc${(i % 6) + 1}.png`;

        doctors.push({
            name: name,
            specialization: specialization,
            experience: getRandomInt(2, 25),
            fee: getRandomInt(300, 2000),
            location: city,
            image: image,
            about: `${name} is a highly experienced ${specialization} practicing in ${city}. They are dedicated to providing the best medical care to their patients with over ${getRandomInt(2, 25)} years of experience in the field.`,
            slots: ["09:00", "10:00", "11:00", "14:00", "16:00", "18:00"].sort(() => 0.5 - Math.random()).slice(0, 4),
            available: true
        });
    }
    return doctors;
};

const seedDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/medconnect");
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        await Doctor.deleteMany();
        console.log("Existing doctors removed");

        const doctors = generateDoctors(40); // Generating 40 doctors
        await Doctor.insertMany(doctors);

        console.log(`Successfully imported ${doctors.length} doctors!`);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedDB();
