import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: [3, "First Name Must Contain At Least 3 Character!"]
     },
     lastName:{
        type: String,
        required: true,
        minLength: [3, "Last Name Must Contain At Least 3 Character!"]
     },
     email:{
        type: String,
        required: true,
        validate: [validator.isEmail, "Please Provide Valid Email!"]
     },
     phone:{
        type: String,
        required: true,
        minLength: [10, "Phone Number Must Contain  Exact 10 Digits!"],
        maxLength: [10, "Phone Number Must Contain  Exact 10 Digits!"],
     },
      message:{
        type: String,
        required: true,
        minLength: [10, "Message Must Contain At Least 10 Digits!"]
        },
      reply: {
        type: String,
        trim: true,
        maxLength: [500, "Reply Cannot Exceed 500 Characters!"],
        default: "",
      },
      repliedAt: {
        type: Date,
      },
}, { timestamps: true });

export const Message = mongoose.model("Message",messageSchema);
