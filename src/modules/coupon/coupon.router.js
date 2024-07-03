import express from "express"
import { createCopon, deleteCopon, getAllCopons, getCopon, updateCopon } from "./coupon.controller.js"
import { allowTo, protectedRoutes } from "../../middleware/protectedRoute.js";

const couponRouter = express.Router()

couponRouter.post('/create-coupon',protectedRoutes,allowTo('admin'),createCopon)
couponRouter.get('/get-all-coupon',allowTo('admin'),getAllCopons)
couponRouter.get('/get-coupon/:id',getCopon)
couponRouter.put('/update-coupon/:id',protectedRoutes,allowTo('admin'),updateCopon)
couponRouter.delete('/delete-coupon/:id',protectedRoutes,allowTo('admin'),deleteCopon)


export default couponRouter