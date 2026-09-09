import express from "express";
import { getAllMessages, replyToMessage, sendMessage, getMyMessages } from "../controller/messageController.js";
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";
 
const router = express.Router();

router.post("/send", sendMessage);
router.get("/getall", isAdminAuthenticated, getAllMessages);
router.get("/my", isPatientAuthenticated, getMyMessages);
router.put("/reply/:id", isAdminAuthenticated, replyToMessage);

export default router;
