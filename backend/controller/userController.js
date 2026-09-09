import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, phone, password, gender, dob, nic, role } = req.body;
    const email = req.body.email?.toLowerCase().trim();
    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !role) {
        return next(new ErrorHandler("Please Fill Full Form!", 400));
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler("User Already Registered!", 400));
    }
    const user = await User.create({
        firstName, lastName, email, phone, password, gender, dob, nic, role
    });
    res.status(200).json({
        success: true,
        message: "User Registered Successfully! Please Login."
    });
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password, confirmPassword, role } = req.body;
    if (!email || !password || !role) {
        return next(new ErrorHandler("Please Provide All Details!", 400));
    }
    if (confirmPassword && password !== confirmPassword) {
        return next(new ErrorHandler("Password and Confirm Password Do Not Match!", 400));
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Password Or Email!", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Password Or Email!", 400));
    }
    if (role !== user.role) {
        return next(new ErrorHandler("User With This Role Not Found!", 400));
    }
    generateToken(user, "User Logged In Successfully!", 200, res);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob, nic } = req.body;
    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic) {
        return next(new ErrorHandler("Please Fill Full Form!", 400));
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} with this email already exists!`, 400));
    }
    const admin = await User.create({
        firstName, lastName, email, phone, password, gender, dob, nic, role: "Admin"
    });
    res.status(200).json({
        success: true,
        message: "New Admin Registered!",
        admin,
    });
});

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
    const doctors = await User.find({ role: "Doctor" });
    res.status(200).json({
        success: true,
        doctors,
    });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("adminToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({
        success: true,
        message: "Admin Logged Out Successfully!",
    });
});

export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("patientToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({
        success: true,
        message: "Patient Logged Out Successfully!",
    });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Doctor Avatar Required!", 400));
    }
    const { docAvatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
        return next(new ErrorHandler("File Format Not Supported!", 400));
    }
    const { firstName, lastName, email, phone, password, gender, dob, nic, doctorDepartment } = req.body;
    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !doctorDepartment) {
        return next(new ErrorHandler("Please Provide Full Details!", 400));
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} already registered with this email!`, 400));
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary Error");
        return next(new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500));
    }
    const doctor = await User.create({
        firstName, lastName, email, phone, password, gender, dob, nic, doctorDepartment, role: "Doctor",
        docAvatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        }
    });
    res.status(200).json({
        success: true,
        message: "New Doctor Registered!",
        doctor,
    });
});

export const deleteDoctor = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    let doctor = await User.findById(id);
    if (!doctor) {
        return next(new ErrorHandler("Doctor not found!", 404));
    }
    if (doctor.role !== "Doctor") {
        return next(new ErrorHandler("Invalid user role!", 400));
    }
    await doctor.deleteOne();
    res.status(200).json({
        success: true,
        message: "Doctor Deleted Successfully!",
    });
});

export const updateDoctor = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    let doctor = await User.findById(id);
    if (!doctor) {
        return next(new ErrorHandler("Doctor not found!", 404));
    }
    if (doctor.role !== "Doctor") {
        return next(new ErrorHandler("Invalid user role!", 400));
    }
    doctor = await User.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        message: "Doctor Details Updated Successfully!",
        doctor,
    });
});
