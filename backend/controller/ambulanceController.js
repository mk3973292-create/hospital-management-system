import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { AmbulanceRequest } from "../models/ambulanceRequestSchema.js";

export const requestAmbulance = catchAsyncErrors(async (req, res, next) => {
  const { patientName, phone, latitude, longitude, address, note } = req.body;

  if (!patientName || !phone || latitude === undefined || longitude === undefined) {
    return next(new ErrorHandler("Please share patient name, phone, and location!", 400));
  }

  const lat = Number(latitude);
  const lng = Number(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return next(new ErrorHandler("Please provide a valid patient location!", 400));
  }

  const ambulanceRequest = await AmbulanceRequest.create({
    patientName,
    phone,
    latitude: lat,
    longitude: lng,
    address,
    note,
  });

  res.status(200).json({
    success: true,
    message: "Ambulance request sent successfully!",
    ambulanceRequest,
  });
});

export const getAllAmbulanceRequests = catchAsyncErrors(async (req, res) => {
  const ambulanceRequests = await AmbulanceRequest.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    ambulanceRequests,
  });
});

export const updateAmbulanceRequestStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const ambulanceRequest = await AmbulanceRequest.findById(id);
  if (!ambulanceRequest) {
    return next(new ErrorHandler("Ambulance request not found!", 404));
  }

  ambulanceRequest.status = status;
  if (status === "Dispatched" && !ambulanceRequest.dispatchedAt) {
    ambulanceRequest.dispatchedAt = new Date();
  }

  await ambulanceRequest.save();

  res.status(200).json({
    success: true,
    message: "Ambulance request updated!",
    ambulanceRequest,
  });
});
