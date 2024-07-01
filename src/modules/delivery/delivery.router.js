import express from 'express'
import { protectedRoutes, allowTo } from '../../middleware/protectedRoute.js';
import { deliverd, getOneOrder, get_orders, paid } from './dilivery.controller.js';

const deliveryRouter = express.Router();

deliveryRouter.get('/get-orders',  protectedRoutes, allowTo('delivery'),get_orders);
deliveryRouter.get('/get-one-order/:id',  protectedRoutes, allowTo('delivery'),getOneOrder);
0
deliveryRouter.put('/deliverd/:id',protectedRoutes,allowTo('delivery'),deliverd)
deliveryRouter.put('/paid/:id',protectedRoutes,allowTo('delivery'),paid)


export default deliveryRouter