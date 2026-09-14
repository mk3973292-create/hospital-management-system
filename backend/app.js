import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import ambulanceRouter from "./router/ambulanceRouter.js";
import packageEnrollmentRouter from "./router/packageEnrollmentRouter.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (one level above backend/)
config({ path: path.resolve(__dirname, "../.env") });

const app = express();

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            const allowed = [
                process.env.FRONTEND_URL_ONE,
                process.env.DASHBOARD_URL,
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "http://localhost:5176"
            ].filter(Boolean);

            if (allowed.includes(origin) || origin.endsWith(".vercel.app")) {
                return callback(null, true);
            }
            return callback(null, true);
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use("/api/v1/ambulance", ambulanceRouter);
app.use("/api/v1/package", packageEnrollmentRouter);

// Serve built React apps in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "../frontend/dist")));
    app.use("/admin", express.static(path.resolve(__dirname, "../dashboard/dist")));

    app.get(/^\/admin(\/.*)?$/, (req, res) => {
        res.sendFile(path.resolve(__dirname, "../dashboard/dist/index.html"));
    });

    app.get(/^\/(.*)/, (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
    });
}

app.use(errorMiddleware);

export default app;
