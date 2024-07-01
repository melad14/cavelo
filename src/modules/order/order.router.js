import express from "express"
import {   AdminGetOrder, completeDelivry, completeInDoor, ctreateCashOrder, deliverd, getAllorders, getSpecificorders, paid } from "./order.controller.js"
import { allowTo, protectedRoutes } from "../../middleware/protectedRoute.js";

const orderRouter = express.Router()
orderRouter.post('/cash/:id',protectedRoutes,allowTo('user','delivery'),ctreateCashOrder)
orderRouter.get('/get-user-order',protectedRoutes,allowTo('user'),getSpecificorders)
orderRouter.get('/get-all-orders',protectedRoutes,allowTo('user','delivery'),getAllorders)
orderRouter.get('/admin-get-order/:id',protectedRoutes,allowTo('user'),AdminGetOrder)
orderRouter.put('/complete-delivery/:id',protectedRoutes,allowTo('user','delivery'),completeDelivry)
orderRouter.put('/complete-inDoor/:id',protectedRoutes,allowTo('user'),completeInDoor)
orderRouter.put('/deliverd/:id',protectedRoutes,allowTo('user'),deliverd)
orderRouter.put('/paid/:id',protectedRoutes,allowTo('user'),paid)


export default orderRouter