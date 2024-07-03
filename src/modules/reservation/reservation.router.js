import express from 'express';
import { createReservation, getReservations, getReservation, updateReservation, deleteReservation } from './reservation.controller.js';
import { allowTo, protectedRoutes } from '../../middleware/protectedRoute.js';

const tableRouter = express.Router();


tableRouter.post('/create-reserv',protectedRoutes,allowTo('user'),createReservation)
tableRouter.get('/get-all-reservs',protectedRoutes,allowTo('admin'),getReservations);

tableRouter.get('/get-reserv/:id',protectedRoutes,allowTo('user','admin'),getReservation)
tableRouter.put('/update-reserv/:id',protectedRoutes,allowTo('user'),updateReservation)
tableRouter.delete('/delete/:id',protectedRoutes,allowTo('user'),deleteReservation);

export default tableRouter;
