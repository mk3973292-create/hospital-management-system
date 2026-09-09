import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import messageRouter from "./router/messageRouter.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = express();
config({ path: "./config/config.env" });

app.use(
    cors({
        origin: [
          process.env.FRONTEND_URL_ONE, 
          process.env.DASHBOARD_URL,
          "http://localhost:5173",
          "http://localhost:5174",
          "http://localhost:5175",
          "http://localhost:5176"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp",
})
);
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import ambulanceRouter from "./router/ambulanceRouter.js";
import packageEnrollmentRouter from "./router/packageEnrollmentRouter.js";

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use("/api/v1/ambulance", ambulanceRouter);
app.use("/api/v1/package", packageEnrollmentRouter);

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.resolve(__dirname, "../frontend/dist")));
app.use("/admin", express.static(path.resolve(__dirname, "../dashboard/dist")));

app.get(/^\/admin(\/.*)?$/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "../dashboard/dist/index.html"));
});

app.get(/^\/(.*)/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});

app.use(errorMiddleware);

export default app;
