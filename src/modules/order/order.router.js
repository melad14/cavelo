import express from "express"
import {   AdminGetOrder, cancel, complete, ctreateCashOrder, deliverd, getAllorders, getCurrentDayInvoices,
     getIncomesByDay, getMonthInvoices, getOrdersByDay, getSpecificorders, getTodayorders, paid, userGetOrder, userGetOrderHistory } from "./order.controller.js"
import { allowTo, protectedRoutes } from "../../middleware/protectedRoute.js";

const orderRouter = express.Router()
orderRouter.post('/cash/:id',protectedRoutes,allowTo('user'),ctreateCashOrder)
orderRouter.get('/get-user-order',protectedRoutes,allowTo('user'),getSpecificorders)
orderRouter.get('/get-all-orders',protectedRoutes,allowTo('admin'),getAllorders)
orderRouter.get('/get-today-orders',protectedRoutes,allowTo('admin'),getTodayorders)
orderRouter.get('/get-day-orders',protectedRoutes,allowTo('admin'),getOrdersByDay)
orderRouter.get('/admin-get-order/:id',protectedRoutes,allowTo('admin'),AdminGetOrder)
orderRouter.get('/user-get-order/:id',protectedRoutes,allowTo('user'),userGetOrder)
orderRouter.put('/complete/:id',protectedRoutes,allowTo('admin'),complete)
orderRouter.put('/deliverd/:id',protectedRoutes,allowTo('admin'),deliverd)
orderRouter.put('/paid/:id',protectedRoutes,allowTo('admin'),paid)
orderRouter.put('/cancel/:id',protectedRoutes,allowTo('admin','user'),cancel)

orderRouter.get('/get-day-incomes',protectedRoutes,allowTo('admin'),getIncomesByDay)
orderRouter.get('/get-today-incomes',protectedRoutes,allowTo('admin'),getCurrentDayInvoices)
orderRouter.get('/get-month-incomes',protectedRoutes,allowTo('admin'),getMonthInvoices)

orderRouter.get('/my-orders',protectedRoutes,allowTo('user'),userGetOrderHistory)

export default orderRouter