import express from 'express'
import {  blockList, blockUser, create_account, editUserRole, getUsers, signIn_admin, specificUser, unblockUser, verifyOTP } from './admin.controller.js';
import { protectedRoutes, allowTo } from '../../middleware/protectedRoute.js';
import { signInSchema, verifySchema } from './admin.validiation.js';
import { validation } from '../../middleware/validation.js';

const adminRouter = express.Router();

adminRouter.post('/create-account',  protectedRoutes, allowTo('admin'),create_account);
adminRouter.post('/signin-admin',validation(signInSchema)  ,signIn_admin);
adminRouter.post('/verify',validation(verifySchema) ,verifyOTP);
adminRouter.get('/get-allUsers', protectedRoutes, allowTo('admin'), getUsers);
adminRouter.get('/get-user/:id', protectedRoutes, allowTo('admin'), specificUser);
adminRouter.put('/edit-user-role/:id', protectedRoutes, allowTo('admin'), editUserRole);

adminRouter.put('/block-user/:id', protectedRoutes, allowTo('admin'), blockUser);
adminRouter.put('/unblock-user/:id', protectedRoutes, allowTo('admin'), unblockUser);



export default adminRouter