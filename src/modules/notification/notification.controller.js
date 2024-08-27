import { notificationModel } from "../../../databases/models/notifcation.js";
import { AppErr } from "../../utils/AppErr.js";
import { catchAsyncErr } from "../../utils/catcherr.js";
import cron from 'node-cron';
import Pusher from 'pusher';
import { sendNotificationToAll } from "./oneSignalPushNotification.js";

const pusher = new Pusher({
    appId: "1832769",
    key: "74fa23b5f9fdd3fa37f0",
    secret: "c59f35157bcebbfb400a",
    cluster: "eu",
    useTLS: true
  });
  
  
  

export const createNotifications = catchAsyncErr(async (req, res, next) => {
    const{title,message}=req.body
    notid='admin'
    const notification = new notificationModel({title,message,notid});
    await notification.save()
    await sendNotificationToAll(title,message)
    res.status(200).json({ "message": " success", "statusCode":200 ,notification })

});
export const getNotifications = catchAsyncErr(async (req, res, next) => {

    const notifications = await notificationModel.find().sort({ createdAt: -1 });

    res.status(200).json({ "message": " success", "statusCode":200 ,notifications })

});
export const getAdminNotifications = catchAsyncErr(async (req, res, next) => {
    try {
        const notifications = await notificationModel.find({ notid: "admin" }).sort({ createdAt: -1 });
      
        res.status(200).json({ message: "Success", statusCode: 200, notifications });
    } catch (error) {
      
        next(error);
    }
});


export const updateNotification = catchAsyncErr(async (req, res, next) => {
    
        const notification = await notificationModel.findById(req.params.id);
        if (!notification) {
            return next(new AppErr("Notification not found", 404));
        } else {
            notification.status ? (notification.status = "read") : notification?.status;
        }

        await notification.save();

        const notifications = await notificationModel.find().sort({ createdAt: -1 });

        res.status(200).json({ "message": " success","statusCode":200 ,  notifications});
 
});

export const getOneNotification = catchAsyncErr(async (req, res, next) => {
const{id}=req.params
        const notification = await notificationModel.findById(id);
        if (!notification) {
            return next(new AppErr("Notification not found", 404));
        } else {
            notification.status ? (notification.status = "read") : notification?.status;
        }

     await notification.save();


        res.status(200).json({ "message": " success","statusCode":200 ,  notification, });
 
});

cron.schedule("0 0 0 * * *", async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await notificationModel.deleteMany({ status: "read", createdAt: { $lt: thirtyDaysAgo } });
});