import express from "express"
import { addAdress, getAllAdresses, removeAdress, updateAddress } from "./address.controller.js";
import { allowTo, protectedRoutes } from "../../middleware/protectedRoute.js";

const addressRouter = express.Router()
addressRouter.patch('/add-address',protectedRoutes,allowTo('user'),addAdress)
addressRouter.put('/update-address/:id',protectedRoutes,allowTo('user'),updateAddress)
addressRouter.delete('/remove',protectedRoutes,allowTo('user'),removeAdress)
addressRouter.get('/get-addresses',protectedRoutes,allowTo('user'),getAllAdresses)


export default addressRouter