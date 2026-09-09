import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";

const clearAuthCookie = (res, cookieName) => {
    res.clearCookie(cookieName, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });
};

const decodeToken = (token, res, cookieName) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
        clearAuthCookie(res, cookieName);
        throw error;
    }
};

export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {
        return next(new ErrorHandler("Admin Not Authenticated!", 401));
    }
    const decoded = decodeToken(token, res, "adminToken");
    req.user = await User.findById(decoded.id);
    if (!req.user) {
        clearAuthCookie(res, "adminToken");
        return next(new ErrorHandler("User not found or session expired", 401));
    }
    if (req.user.role !== "Admin") {
        return next(new ErrorHandler(`${req.user.role} not authorized for this resource!`, 403));
    }
    next();
});

export const isPatientAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.patientToken;
    if (!token) {
        return next(new ErrorHandler("Patient Not Authenticated!", 401));
    }
    const decoded = decodeToken(token, res, "patientToken");
    req.user = await User.findById(decoded.id);
    if (!req.user) {
        clearAuthCookie(res, "patientToken");
        return next(new ErrorHandler("User not found or session expired", 401));
    }
    if (req.user.role !== "Patient") {
        return next(new ErrorHandler(`${req.user.role} not authorized for this resource!`, 403));
    }
    next();
});
