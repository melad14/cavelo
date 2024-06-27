import express from "express"
import { addTocart, applyCoupon, getLoggedUserCart, removeFromCart, updateQuantity } from "./cart.controller.js"
import { allowTo, protectedRoutes } from "../../middleware/protectedRoute.js"

const cartRouter = express.Router()
cartRouter.post('/add-to-cart',protectedRoutes,allowTo('user'),addTocart)
cartRouter.get('/get-user-cart',protectedRoutes,allowTo('user'),getLoggedUserCart)
cartRouter.put('/update-quantity/:id',protectedRoutes,allowTo('user'),updateQuantity)
cartRouter.post('/apllyCopon',protectedRoutes,allowTo('user'),applyCoupon)


cartRouter.put('/remove-from-cart/:id',protectedRoutes,allowTo('user'),removeFromCart)


export default cartRouter