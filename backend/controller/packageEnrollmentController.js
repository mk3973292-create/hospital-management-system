import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { PackageEnrollment } from "../models/packageEnrollmentSchema.js";

export const enrollPackage = catchAsyncErrors(async (req, res, next) => {
  const {
    packageTitle,
    packagePrice,
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    preferredDate,
    paymentMethod,
    paymentStatus,
  } = req.body;

  if (
    !packageTitle ||
    !packagePrice ||
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !preferredDate ||
    !paymentMethod
  ) {
    return next(new ErrorHandler("Please fill the full package enrollment form!", 400));
  }

  const enrollment = await PackageEnrollment.create({
    packageTitle,
    packagePrice: Number(packagePrice),
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    preferredDate,
    paymentMethod,
    paymentStatus: paymentStatus || "Payment Successful",
  });

  res.status(200).json({
    success: true,
    message: "Package enrolled successfully!",
    enrollment,
  });
});

export const getAllPackageEnrollments = catchAsyncErrors(async (req, res) => {
  const enrollments = await PackageEnrollment.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    enrollments,
  });
});
