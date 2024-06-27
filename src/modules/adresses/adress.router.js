import express from "express"
import { addAdress, getAllAdresses, removeAdress } from "./address.controller.js";
import { allowTo, protectedRoutes } from "../../middleware/protectedRoute.js";
import { addressRemoveSchema, addressSchema } from "./adress.validation.js";
import { validation } from './../../middleware/validation.js';

const adressRouter = express.Router()
adressRouter.patch('/',protectedRoutes,allowTo('user'),validation(addressSchema) ,addAdress)
adressRouter.delete('/',protectedRoutes,allowTo('user'),validation(addressRemoveSchema) ,removeAdress)
adressRouter.get('/',protectedRoutes,allowTo('user'),getAllAdresses)


export default adressRouter