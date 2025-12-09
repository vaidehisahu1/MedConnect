import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Doctor from "./models/Doctor.js";
import bcrypt from "bcryptjs";

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const testEmail = "debug_doctor_" + Date.now() + "@test.com";
        const testPassword = "password123";

        console.log("1. Creating Doctor User:", testEmail);

        // 1. Manually create user (simulating registerDoctor controller logic)
        const user = await User.create({
            name: "Debug Doctor",
            email: testEmail,
            password: testPassword,
            role: "doctor"
        });
        console.log("User created:", user._id);

        // 2. Create Doctor profile
        const doctor = await Doctor.create({
            user: user._id,
            name: "Debug Doctor",
            specialization: "General",
            experience: 5,
            fee: 500,
            location: "Delhi",
            about: "Experienced doctor.",
            slots: []
        });
        console.log("Doctor profile created:", doctor._id);

        // 3. Verify Login
        console.log("3. Attempting Login...");
        const foundUser = await User.findOne({ email: testEmail });

        if (!foundUser) {
            console.error("Login Failed: User not found");
            process.exit(1);
        }

        console.log("User found. Role:", foundUser.role);

        const isMatch = await foundUser.matchPassword(testPassword);
        console.log("Password Match Result:", isMatch);

        if (isMatch && foundUser.role === 'doctor') {
            console.log("SUCCESS: Login logic is working correctly.");
        } else {
            console.error("FAILURE: Password match failed or role mismatch.");
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
