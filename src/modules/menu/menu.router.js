import express from 'express'
import { allowTo, protectedRoutes } from '../../middleware/protectedRoute.js';
import { upload } from '../../utils/fileUp.js';
import { 
    createItem, deleteItem, editItem, getAllMenu, getAllMenuByCat, 
    getitem, getSuggestedItems, suggestItem, unsuggestItem
 } from './menu.controller.js';



let menuRouter = express.Router();


menuRouter.post('/create-item', protectedRoutes, allowTo('admin'),
    upload.fields([{ name: 'image', maxCount: 1 } ]), createItem);


menuRouter.put('/edit-item/:id', protectedRoutes, allowTo('admin'),
    upload.fields([ { name: 'image', maxCount: 1 }]), editItem);


menuRouter.get('/get-item/:id', protectedRoutes, allowTo('user','admin','waiter'), getitem);
menuRouter.get('/get-menu', protectedRoutes, allowTo('user','admin','waiter'), getAllMenu);
menuRouter.get('/get-menu/category/', protectedRoutes, allowTo('user','admin','waiter'), getAllMenuByCat);

menuRouter.delete('/delete-item/:id', protectedRoutes, allowTo('admin'), deleteItem);

menuRouter.patch('/suggest/:id', protectedRoutes, allowTo('admin'), suggestItem);
menuRouter.patch('/unsuggest/:id', protectedRoutes, allowTo('admin'), unsuggestItem);


menuRouter.get('/suggested',protectedRoutes, allowTo('admin','user','waiter'), getSuggestedItems);

export default menuRouter
