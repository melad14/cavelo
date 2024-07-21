import express from "express"
import {   AdminGetOrder, cancel, complete, ctreateCashOrder, deliverd, getAllorders, getAllordersIncomes, getSpecificorders, paid, userGetOrder, userGetOrderHistory } from "./order.controller.js"
import { allowTo, protectedRoutes } from "../../middleware/protectedRoute.js";

const orderRouter = express.Router()
orderRouter.post('/cash/:id',protectedRoutes,allowTo('user'),ctreateCashOrder)
orderRouter.get('/get-user-order',protectedRoutes,allowTo('user'),getSpecificorders)
orderRouter.get('/get-all-orders',protectedRoutes,allowTo('admin'),getAllorders)
orderRouter.get('/admin-get-order/:id',protectedRoutes,allowTo('admin'),AdminGetOrder)
orderRouter.get('/user-get-order/:id',protectedRoutes,allowTo('user'),userGetOrder)
orderRouter.put('/complete/:id',protectedRoutes,allowTo('admin'),complete)
orderRouter.put('/deliverd/:id',protectedRoutes,allowTo('admin'),deliverd)
orderRouter.put('/paid/:id',protectedRoutes,allowTo('admin'),paid)
orderRouter.put('/cancel/:id',protectedRoutes,allowTo('admin','user'),cancel)

orderRouter.get('/get-all-incomes',protectedRoutes,allowTo('admin'),getAllordersIncomes)

orderRouter.get('/my-orders',protectedRoutes,allowTo('user'),userGetOrderHistory)

export default orderRouter