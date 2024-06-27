import Reservation from "../../../databases/models/reservation.js";
import { userModel } from "../../../databases/models/users.js";
import { AppErr } from './../../utils/AppErr.js';
import { catchAsyncErr } from './../../utils/catcherr.js';


export const createReservation =catchAsyncErr( async (req, res, next) => {
        const id=req.user._id
        let user=await userModel.findById(id)
        req.body.name=user.name
        req.body.email=user.email

        const reservation = new Reservation(req.body);
        if(!reservation) return  next(new AppErr('error creating reservation', 200))
        await reservation.save();
        res.status(201).json({ message: "success", data: reservation });

});


export const getReservations =catchAsyncErr( async (req, res, next) => {
   
        const reservations = await Reservation.find();
        if(!reservations) return  next(new AppErr('error fetshing reservation', 200))

        res.status(200).json({ message: "success", data: reservations });
   
});


export const getReservation =catchAsyncErr( async (req, res, next) => {
    
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation)  return next(new AppErr('Reservation not found', 200));
    
        res.status(200).json({ message: "success", data: reservation });
   
});

export const updateReservation =catchAsyncErr( async (req, res, next) => {

        const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!reservation) return next(new AppErr('Reservation not found', 200));
        
        res.status(200).json({ message: "success", data: reservation });
    
});

export const deleteReservation =catchAsyncErr( async (req, res, next) => {
    
        const reservation = await Reservation.findByIdAndDelete(req.params.id);
        if (!reservation)  return next(new AppErr('Reservation not found', 200));
    
        res.status(201).json({ message: "success" })

});
