import express from 'express'
import { createUser, create_admin, getUsers, signIn_admin, specificUser } from './admin.controller.js';
import { protectedRoutes, allowTo } from '../../middleware/protectedRoute.js';

const adminRouter = express.Router();

adminRouter.post('/create-admin',  protectedRoutes, allowTo('user'),create_admin);
adminRouter.post('/signin-admin',  protectedRoutes, allowTo('user'),signIn_admin);
adminRouter.post('/create-user',  protectedRoutes, allowTo('user'),createUser);
adminRouter.get('/get-allUsers', protectedRoutes, allowTo('user'), getUsers);
adminRouter.get('/get-user/:id', protectedRoutes, allowTo('user'), specificUser);

export default adminRouter