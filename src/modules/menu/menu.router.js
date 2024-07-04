import express from 'express'
import { allowTo, protectedRoutes } from '../../middleware/protectedRoute.js';
import { upload } from '../../utils/fileUp.js';
import { createItem, deleteItem, editItem, getAllMenu, getitem, getSuggestedItems, suggestItem, unsuggestItem } from './menu.controller.js';



let menuRouter = express.Router();


menuRouter.post('/create-item', protectedRoutes, allowTo('admin'),
    upload.fields([{ name: 'image', maxCount: 1 } ]), createItem);


menuRouter.put('/edit-item/:id', protectedRoutes, allowTo('admin'),
    upload.fields([ { name: 'image', maxCount: 1 }]), editItem);


menuRouter.get('/get-item/:id', protectedRoutes, allowTo('user','admin'), getitem);
menuRouter.get('/get-menu', protectedRoutes, allowTo('user','admin'), getAllMenu);

menuRouter.delete('/delete-item/:id', protectedRoutes, allowTo('admin'), deleteItem);

// Routes for admin to mark/unmark items as suggested
menuRouter.patch('/suggest/:id', protectedRoutes, allowTo('admin'), suggestItem);
menuRouter.patch('/unsuggest/:id', protectedRoutes, allowTo('admin'), unsuggestItem);

// Route for users to get suggested items
menuRouter.get('/suggested',protectedRoutes, allowTo('admin','user'), getSuggestedItems);

export default menuRouter
