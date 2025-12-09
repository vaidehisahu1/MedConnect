import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Doctor from "./models/Doctor.js";

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const testEmail = "test_doctor_demo@example.com";
        const testPassword = "password123";

        // 1. Cleanup existing if any
        await User.findOneAndDelete({ email: testEmail });
        console.log("Cleaned up old test user");

        // 2. Create User
        const user = await User.create({
            name: "Test Doctor",
            email: testEmail,
            password: testPassword,
            role: "doctor"
        });

        // 3. Create Doctor Profile
        await Doctor.create({
            user: user._id,
            name: "Test Doctor",
            specialization: "General Physician",
            experience: 10,
            fee: 500,
            location: "Delhi",
            about: "This is a test account.",
            slots: []
        });

        console.log("\n=================================");
        console.log("✅ TEST ACCOUNT CREATED");
        console.log("Email: " + testEmail);
        console.log("Password: " + testPassword);
        console.log("=================================\n");

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
