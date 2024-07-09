import express from 'express'
import {  create_account, editUserRole, getUsers, signIn_admin, specificUser } from './admin.controller.js';
import { protectedRoutes, allowTo } from '../../middleware/protectedRoute.js';

const adminRouter = express.Router();

adminRouter.post('/create-account',  protectedRoutes, allowTo('admin'),create_account);
adminRouter.post('/signin-admin',  protectedRoutes, allowTo('admin'),signIn_admin);
adminRouter.get('/get-allUsers', protectedRoutes, allowTo('admin'), getUsers);
adminRouter.get('/get-user/:id', protectedRoutes, allowTo('admin'), specificUser);
adminRouter.put('/edit-user-role/:id', protectedRoutes, allowTo('admin'), editUserRole);

export default adminRouter