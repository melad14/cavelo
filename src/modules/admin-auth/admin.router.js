import express from 'express'
import { createUser, create_admin, editUserRole, getUsers, signIn_admin, specificUser } from './admin.controller.js';
import { protectedRoutes, allowTo } from '../../middleware/protectedRoute.js';

const adminRouter = express.Router();

adminRouter.post('/create-admin',  protectedRoutes, allowTo('admin'),create_admin);
adminRouter.post('/signin-admin',  protectedRoutes, allowTo('admin'),signIn_admin);
adminRouter.post('/create-user',  protectedRoutes, allowTo('admin'),createUser);
adminRouter.get('/get-allUsers', protectedRoutes, allowTo('admin'), getUsers);
adminRouter.get('/get-user/:id', protectedRoutes, allowTo('admin'), specificUser);
adminRouter.put('/edit-user-role/:id', protectedRoutes, allowTo('admin'), editUserRole);

export default adminRouter