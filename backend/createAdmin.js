import { config } from "dotenv";
import { dbconnection } from "./database/dbconnection.js";
import { User } from "./models/userSchema.js";
import mongoose from "mongoose";

config({ path: "./config/config.env" });

const createAdmin = async () => {
    try {
        await dbconnection();
        
        const existingAdmin = await User.findOne({ email: "admin@hospital.com" });
        if (existingAdmin) {
            console.log("Admin already exists! Email: admin@hospital.com, Password: password123 (if using default)");
        } else {
            const admin = await User.create({
                firstName: "Super",
                lastName: "Admin",
                email: "admin@hospital.com",
                phone: "1111111111",
                password: "password123",
                gender: "Male",
                dob: new Date("1990-01-01"),
                nic: "111111111111",
                role: "Admin"
            });
            console.log("Admin created successfully! Email: admin@hospital.com, Password: password123");
        }
        mongoose.disconnect();
    } catch (err) {
        console.error("Error creating admin:", err);
        mongoose.disconnect();
    }
};

createAdmin();
