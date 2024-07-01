import express from 'express'
import { protectedRoutes, allowTo } from '../../middleware/protectedRoute.js';
import { addSchedule, editSchedule, getSchedules } from './schedule.controller.js';


const scheduleRouter  = express.Router()


scheduleRouter.post('/add-schedule',  protectedRoutes, allowTo('delivery'),addSchedule)
scheduleRouter.put('/edit-schedule/:id',  protectedRoutes, allowTo('delivery'),editSchedule)
scheduleRouter.get('/get-schedule',  protectedRoutes, allowTo('delivery'),getSchedules)


export default scheduleRouter 