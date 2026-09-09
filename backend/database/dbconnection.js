import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { seedDoctors, seedAdmin, seedDummyPatients } from "./seedData.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";

let mongoServer;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localDbPath = path.resolve(__dirname, "../data/local-mongo");

const startLocalMongo = async () => {
    fs.mkdirSync(localDbPath, { recursive: true });
    mongoServer = await MongoMemoryServer.create({
        instance: {
            dbPath: localDbPath,
            storageEngine: "wiredTiger",
        },
    });
    return mongoServer.getUri();
};

export const dbconnection = async () => {
    const connect = async (mongoUri) => {
        await mongoose.connect(mongoUri, {
            dbName: "MERN_STACK_HOSPITAL_MANAGEMENT_SYSTEM",
            serverSelectionTimeoutMS: 5000,
        });
    };

    try {
        if (process.env.MONGO_URL) {
            try {
                await connect(process.env.MONGO_URL);
                console.log("Connected to MongoDB database.");
            } catch (error) {
                console.log(`MongoDB Atlas connection failed: ${error.message}`);
                console.log("Attempting to resolve DNS issues by setting public DNS servers (8.8.8.8, 1.1.1.1)...");
                try {
                    dns.setServers(["8.8.8.8", "1.1.1.1"]);
                    console.log("Retrying connection to MongoDB Atlas...");
                    await connect(process.env.MONGO_URL);
                    console.log("Connected to MongoDB database (after DNS fallback).");
                } catch (retryError) {
                    console.log(`Retry failed: ${retryError.message}`);
                    console.log(`Falling back to local persistent database at ${localDbPath}.`);
                    await connect(await startLocalMongo());
                }
            }
        } else {
            await connect(await startLocalMongo());
            console.log(`MONGO_URL not set. Connected to local persistent database at ${localDbPath}.`);
        }

        await seedDoctors();
        await seedAdmin();
        await seedDummyPatients();
    } catch (err) {
        console.log(`Some error occurred while connecting to database: ${err}`);
        throw err;
    }
};
