import express from "express";
import { 
    deleteAppointment, 
    getAllAppointments, 
    getMyAppointments,
    postAppointment, 
    replyToAppointment,
    updateAppointmentStatus 
} from "../controller/appointmentController.js";
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isPatientAuthenticated, postAppointment);
router.get("/my", isPatientAuthenticated, getMyAppointments);
router.get("/getall", isAdminAuthenticated, getAllAppointments);
router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);
router.put("/reply/:id", isAdminAuthenticated, replyToAppointment);
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);

export default router;
