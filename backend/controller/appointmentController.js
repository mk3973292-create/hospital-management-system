import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, address, nic, dob, gender, appointment_date, department, doctor_firstName, doctor_lastName, doctorId, hasVisited, patientMessage, medicalRecord } = req.body;
    
    if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !appointment_date || !department || (!doctorId && (!doctor_firstName || !doctor_lastName))) {
        return next(new ErrorHandler("Please Fill Full Form!", 400));
    }

    let doctor;
    if (doctorId) {
        doctor = await User.findOne({ _id: doctorId, role: "Doctor" });
    } else {
        const isConflict = await User.find({
            firstName: doctor_firstName,
            lastName: doctor_lastName,
            role: "Doctor",
            doctorDepartment: department,
        });
        if (isConflict.length > 1) {
            return next(new ErrorHandler("Doctors Conflict! Please Contact Through Email Or Phone!", 404));
        }
        doctor = isConflict[0];
    }

    if (!doctor) {
        return next(new ErrorHandler("Doctor not found!", 404));
    }

    const patientId = req.user._id;
    const appointment = await Appointment.create({
        firstName, lastName, email, phone, address, nic, dob, gender, appointment_date, department: doctor.doctorDepartment || department,
        doctor: {
            firstName: doctor.firstName,
            lastName: doctor.lastName,
        },
        hasVisited,
        doctorId: doctor._id,
        patientId,
        patientMessage: patientMessage || "",
        medicalRecord: medicalRecord || "",
    });
    res.status(200).json({
        success: true,
        message: "Appointment Sent Successfully!",
        appointment,
    });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const limit = Number.isFinite(requestedLimit)
        ? Math.min(Math.max(requestedLimit, 1), 200)
        : 0;
    const query = Appointment.find()
        .sort({ createdAt: -1, _id: -1 })
        .populate("doctorId", "firstName lastName email phone doctorDepartment");

    if (limit) {
        query.limit(limit);
    }

    const appointments = await query;
    res.status(200).json({
        success: true,
        appointments,
    });
});

export const getMyAppointments = catchAsyncErrors(async (req, res, next) => {
    const appointments = await Appointment.find({ patientId: req.user._id }).sort({ appointment_date: -1 });
    res.status(200).json({
        success: true,
        appointments,
    });
});

export const updateAppointmentStatus = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
        return next(new ErrorHandler("Appointment Not Found!", 404));
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        message: "Appointment Status Updated!",
        appointment,
    });
});

export const replyToAppointment = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { doctorReply } = req.body;

    if (!doctorReply || !doctorReply.trim()) {
        return next(new ErrorHandler("Please write a reply!", 400));
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
        return next(new ErrorHandler("Appointment Not Found!", 404));
    }

    appointment.doctorReply = doctorReply.trim();
    appointment.repliedAt = new Date();
    await appointment.save();

    res.status(200).json({
        success: true,
        message: "Reply Sent Successfully!",
        appointment,
    });
});

export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
        return next(new ErrorHandler("Appointment Not Found!", 404));
    }
    await appointment.deleteOne();
    res.status(200).json({
        success: true,
        message: "Appointment Deleted!",
    });
});
