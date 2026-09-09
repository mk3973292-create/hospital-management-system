import express from "express";
import { enrollPackage, getAllPackageEnrollments } from "../controller/packageEnrollmentController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/enroll", enrollPackage);
router.get("/getall", isAdminAuthenticated, getAllPackageEnrollments);

export default router;
