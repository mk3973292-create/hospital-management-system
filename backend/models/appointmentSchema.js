import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [3, "First Name Must Contain At Least 3 Characters!"]
    },
    lastName: {
        type: String,
        required: true,
        minLength: [3, "Last Name Must Contain At Least 3 Characters!"]
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please Provide Valid Email!"]
    },
    phone: {
        type: String,
        required: true,
        minLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
        maxLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
    },
    address: {
        type: String,
        trim: true,
        maxLength: [300, "Address Cannot Exceed 300 Characters!"],
        default: "",
    },
    nic: {
        type: String,
        required: true,
        minLength: [12, "NIC Must Contain Exact 12 Digits!"],
        maxLength: [12, "NIC Must Contain Exact 12 Digits!"]
    },
    dob: {
        type: Date,
        required: [true, "DOB is required!"],
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"]
    },
    appointment_date: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    doctor: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        }
    },
    hasVisited: {
        type: Boolean,
        default: false,
    },
    doctorId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    patientId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending",
    },
    fee: {
        type: Number,
        default: 500,
    },
    patientMessage: {
        type: String,
        trim: true,
        maxLength: [500, "Message Cannot Exceed 500 Characters!"],
        default: "",
    },
    medicalRecord: {
        type: String,
        trim: true,
        maxLength: [1000, "Medical Record Cannot Exceed 1000 Characters!"],
        default: "",
    },
    doctorReply: {
        type: String,
        trim: true,
        maxLength: [500, "Reply Cannot Exceed 500 Characters!"],
        default: "",
    },
    repliedAt: {
        type: Date,
    }
}, { timestamps: true });

export const Appointment = mongoose.model("Appointment", appointmentSchema);
