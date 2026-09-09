import mongoose from "mongoose";
import validator from "validator";

const packageEnrollmentSchema = new mongoose.Schema(
  {
    packageTitle: {
      type: String,
      required: [true, "Package name is required!"],
      trim: true,
    },
    packagePrice: {
      type: Number,
      required: [true, "Package price is required!"],
    },
    firstName: {
      type: String,
      required: [true, "First name is required!"],
      trim: true,
      minLength: [3, "First name must contain at least 3 characters!"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required!"],
      trim: true,
      minLength: [3, "Last name must contain at least 3 characters!"],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      validate: [validator.isEmail, "Please provide a valid email!"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required!"],
      trim: true,
      minLength: [10, "Phone number must contain exact 10 digits!"],
      maxLength: [10, "Phone number must contain exact 10 digits!"],
    },
    nic: {
      type: String,
      required: [true, "NIC is required!"],
      trim: true,
      minLength: [12, "NIC must contain exact 12 digits!"],
      maxLength: [12, "NIC must contain exact 12 digits!"],
    },
    dob: {
      type: Date,
      required: [true, "DOB is required!"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required!"],
      enum: ["Male", "Female", "Other"],
    },
    preferredDate: {
      type: String,
      required: [true, "Preferred date is required!"],
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required!"],
      enum: ["Cash at Hospital", "UPI", "Credit/Debit Card", "Net Banking"],
    },
    paymentStatus: {
      type: String,
      enum: ["Payment Successful", "Payment Pending", "Payment Failed"],
      default: "Payment Successful",
    },
    status: {
      type: String,
      enum: ["Enrolled", "Completed", "Cancelled"],
      default: "Enrolled",
    },
  },
  { timestamps: true }
);

export const PackageEnrollment = mongoose.model("PackageEnrollment", packageEnrollmentSchema);
