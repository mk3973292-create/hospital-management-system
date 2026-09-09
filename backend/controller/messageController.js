import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Message } from "../models/messageSchema.js";

export const sendMessage = catchAsyncErrors(async(req, res, next) => {
    const { firstName, lastName, email, phone, message } = req.body;
    if (!firstName || !lastName || !email || !phone || !message) {
        return next(new ErrorHandler("Please Fill Full Form", 400));
    }
    await Message.create({ firstName, lastName, email, phone, message });
    res.status(200).json({
        success: true,
        message: "Message Send Successfully!",
    });
});

export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
    const messages = await Message.find().sort({ _id: -1 });
    res.status(200).json({
        success: true,
        messages,
    });
});

export const replyToMessage = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
        return next(new ErrorHandler("Please write a reply!", 400));
    }

    const message = await Message.findById(id);
    if (!message) {
        return next(new ErrorHandler("Message Not Found!", 404));
    }

    message.reply = reply.trim();
    message.repliedAt = new Date();
    await message.save();

    res.status(200).json({
        success: true,
        message: "Reply Sent Successfully!",
        patientMessage: message,
    });
});

export const getMyMessages = catchAsyncErrors(async (req, res, next) => {
    const messages = await Message.find({ email: req.user.email }).sort({ _id: -1 });
    res.status(200).json({
        success: true,
        messages,
    });
});
