import mongoose from "mongoose";

const ambulanceRequestSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: [true, "Patient name is required!"],
      trim: true,
      minLength: [3, "Patient name must contain at least 3 characters!"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required!"],
      trim: true,
      minLength: [10, "Phone number must contain at least 10 digits!"],
      maxLength: [15, "Phone number cannot exceed 15 digits!"],
    },
    latitude: {
      type: Number,
      required: [true, "Patient latitude is required!"],
    },
    longitude: {
      type: Number,
      required: [true, "Patient longitude is required!"],
    },
    address: {
      type: String,
      trim: true,
      maxLength: [300, "Address cannot exceed 300 characters!"],
      default: "",
    },
    note: {
      type: String,
      trim: true,
      maxLength: [300, "Emergency note cannot exceed 300 characters!"],
      default: "",
    },
    status: {
      type: String,
      enum: ["Requested", "Dispatched", "Completed", "Cancelled"],
      default: "Requested",
    },
    dispatchedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const AmbulanceRequest = mongoose.model("AmbulanceRequest", ambulanceRequestSchema);
