import express from 'express'
import { allowTo, protectedRoutes } from '../../middleware/protectedRoute.js';
import { upload } from '../../utils/fileUp.js';
import { createItem, deleteItem, editItem, getAllMenu, getitem } from './menu.controller.js';



let menuRouter = express.Router();


menuRouter.post('/create-item', protectedRoutes, allowTo('user'),
    upload.fields([{ name: 'image', maxCount: 1 } ]), createItem);


menuRouter.put('/edit-item/:id', protectedRoutes, allowTo('user'),
    upload.fields([ { name: 'image', maxCount: 1 }]), editItem);


menuRouter.get('/get-item/:id', protectedRoutes, allowTo('user'), getitem);
menuRouter.get('/get-menu', protectedRoutes, allowTo('user'), getAllMenu);

menuRouter.delete('/delete-item/:id', protectedRoutes, allowTo('user'), deleteItem);



export default menuRouter
