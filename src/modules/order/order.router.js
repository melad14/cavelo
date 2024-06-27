import express from "express"
import {   AdminGetOrder, complete, ctreateCashOrder, deliverd, getAllorders, getSpecificorders, paid } from "./order.controller.js"
import { allowTo, protectedRoutes } from "../../middleware/protectedRoute.js";

const orderRouter = express.Router()
orderRouter.post('/cash/:id',protectedRoutes,allowTo('user'),ctreateCashOrder)
orderRouter.get('/get-user-order',protectedRoutes,allowTo('user'),getSpecificorders)
orderRouter.get('/get-all-orders',protectedRoutes,allowTo('user'),getAllorders)
orderRouter.get('/admin-get-order/:id',protectedRoutes,allowTo('user'),AdminGetOrder)
orderRouter.put('/complete/:id',protectedRoutes,allowTo('user'),complete)
orderRouter.put('/deliverd/:id',protectedRoutes,allowTo('user'),deliverd)
orderRouter.put('/paid/:id',protectedRoutes,allowTo('user'),paid)


export default orderRouter