import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Doctor from "./models/Doctor.js";

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // 1. Find users with role 'doctor'
        const doctorUsers = await User.find({ role: "doctor" });
        console.log(`Found ${doctorUsers.length} users with role 'doctor'`);

        let deletedCount = 0;

        for (const user of doctorUsers) {
            // 2. Check if corresponding Doctor profile exists
            const doctorProfile = await Doctor.findOne({ user: user._id });

            if (!doctorProfile) {
                console.warn(`[CORRUPT DATA DETECTED] User ${user.email} (${user._id}) has role 'doctor' but NO Doctor profile.`);

                // 3. Delete the corrupted user
                await User.findByIdAndDelete(user._id);
                console.log(`[FIXED] Deleted corrupted user: ${user.email}`);
                deletedCount++;
            } else {
                console.log(`[OK] User ${user.email} has valid Doctor profile.`);
            }
        }

        console.log(`\nCleanup Complete. Removed ${deletedCount} broken accounts.`);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
