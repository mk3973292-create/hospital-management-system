import express from "express";
import {
  getAllAmbulanceRequests,
  requestAmbulance,
  updateAmbulanceRequestStatus,
} from "../controller/ambulanceController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/request", requestAmbulance);
router.get("/getall", isAdminAuthenticated, getAllAmbulanceRequests);
router.put("/update/:id", isAdminAuthenticated, updateAmbulanceRequestStatus);

export default router;
