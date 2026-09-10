import mongoose from "mongoose";
import { seedDoctors, seedAdmin, seedDummyPatients } from "./seedData.js";
import dns from "dns";

let isSeeded = false;

export const dbconnection = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    const connect = async (mongoUri) => {
        await mongoose.connect(mongoUri, {
            dbName: "MERN_STACK_HOSPITAL_MANAGEMENT_SYSTEM",
            serverSelectionTimeoutMS: 5000,
        });
    };

    if (!process.env.MONGO_URL) {
        throw new Error("MONGO_URL environment variable is not set. Please add it to your .env file or Vercel Environment Variables.");
    }

    try {
        await connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB database.");
    } catch (error) {
        console.log(`MongoDB Atlas connection failed: ${error.message}`);
        try {
            dns.setServers(["8.8.8.8", "1.1.1.1"]);
            console.log("Retrying connection to MongoDB Atlas with public DNS...");
            await connect(process.env.MONGO_URL);
            console.log("Connected to MongoDB database (after DNS fallback).");
        } catch (retryError) {
            console.log(`Retry failed: ${retryError.message}`);
            throw new Error(`MongoDB connection failed: ${retryError.message}`);
        }
    }

    if (!isSeeded) {
        isSeeded = true;
        Promise.all([seedDoctors(), seedAdmin(), seedDummyPatients()]).catch((err) => {
            console.error("Background seeding warning:", err);
        });
    }
};
