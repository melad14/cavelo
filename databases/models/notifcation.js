import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({

    title:{
        type: String,
        required: true
    },
    message:{
        type:String,
        required: true,
    },
    status:{
        type: String,
        required: true,
        default: "unread"
    },
    notid:{
        type: String,
    }

}, { timestamps: true })



export const notificationModel = mongoose.model('notification', notificationSchema)

