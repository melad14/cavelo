import express from "express"
import {   AdminGetOrder, completeDelivry, completeInDoor, ctreateCashOrder, deliverd, getAllorders, getSpecificorders, paid, userGetOrder } from "./order.controller.js"
import { allowTo, protectedRoutes } from "../../middleware/protectedRoute.js";

const orderRouter = express.Router()
orderRouter.post('/cash/:id',protectedRoutes,allowTo('user'),ctreateCashOrder)
orderRouter.get('/get-user-order',protectedRoutes,allowTo('user'),getSpecificorders)
orderRouter.get('/get-all-orders',protectedRoutes,allowTo('admin'),getAllorders)
orderRouter.get('/admin-get-order/:id',protectedRoutes,allowTo('admin'),AdminGetOrder)
orderRouter.get('/user-get-order/:id',protectedRoutes,allowTo('user'),userGetOrder)
orderRouter.put('/complete-delivery/:id',protectedRoutes,allowTo('admin'),completeDelivry)
orderRouter.put('/complete-inDoor/:id',protectedRoutes,allowTo('admin'),completeInDoor)
orderRouter.put('/deliverd/:id',protectedRoutes,allowTo('admin'),deliverd)
orderRouter.put('/paid/:id',protectedRoutes,allowTo('admin'),paid)


export default orderRouter