import { notificationModel } from "../../../databases/models/notifcation.js";
import Reservation from "../../../databases/models/reservation.js";
import { userModel } from "../../../databases/models/users.js";
import { AppErr } from './../../utils/AppErr.js';
import { catchAsyncErr } from './../../utils/catcherr.js';



import Pusher from 'pusher';

const pusher = new Pusher({
    appId: "1832769",
    key: "74fa23b5f9fdd3fa37f0",
    secret: "c59f35157bcebbfb400a",
    cluster: "eu",
    useTLS: true
  });


export const createReservation =catchAsyncErr( async (req, res, next) => {
        const id=req.user._id
        let user=await userModel.findById(id)
        req.body.first_name=user.first_name
        req.body.last_name=user.last_name
        req.body.email=user.email

        const reservation = new Reservation(req.body);
        if(!reservation) return  next(new AppErr('error creating reservation', 400))
        await reservation.save();
        pusher.trigger('cavelo', 'newReservation', reservation);
        const notification = new notificationModel({
                title: "New reservation Assigned",
                message: `You have been assigned a new reservation. reservation ID: ${reservation._id}`,
                notid: user.first_name
              });
              await notification.save();
        res.status(200).json({ "message": "success", "statusCode":200,data: reservation });

});


export const getReservations =catchAsyncErr( async (req, res, next) => {
   
        const reservations = await Reservation.find();
        if(!reservations) return  next(new AppErr('error fetshing reservation', 404))

        res.status(200).json({ "message": "success", "statusCode":200,data: reservations });
   
});


export const getReservation =catchAsyncErr( async (req, res, next) => {
    
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation)  return next(new AppErr('Reservation not found', 404));
    
        res.status(200).json({ "message": "success","statusCode":200, data: reservation });
   
});

export const updateReservation =catchAsyncErr( async (req, res, next) => {

        const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!reservation) return next(new AppErr('Reservation not found', 404));
        
        res.status(200).json({ "message": "success","statusCode":200, data: reservation });
    
});

export const deleteReservation =catchAsyncErr( async (req, res, next) => {
    
        const reservation = await Reservation.findByIdAndDelete(req.params.id);
        if (!reservation)  return next(new AppErr('Reservation not found', 404));
    
        res.status(200).json({ "message": "success" ,"statusCode":200,})

});
