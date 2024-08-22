import express from 'express'
import { completeProfile, editProfile, getProfile ,deleteAcc, signin, verifyOTP, uploadImage} from './user.controller.js';
import { allowTo, protectedRoutes } from '../../middleware/protectedRoute.js';
import { upload } from '../../utils/fileUp.js';
import { validation } from './../../middleware/validation.js';
import { signInSchema, verifySchema } from './user.validation.js';





let userRouter = express.Router();



userRouter.post('/signin',validation(signInSchema)  ,signin);
userRouter.post('/verify', validation(verifySchema) , verifyOTP);

userRouter.post('/complete-profile', protectedRoutes, allowTo('waiter','user','admin'), completeProfile);


userRouter.post('/upload-pic', protectedRoutes, allowTo('waiter','admin','user'),
    upload.fields([ { name: 'image', maxCount: 1 }]),   uploadImage);

userRouter.put('/edit-profile', protectedRoutes, allowTo('waiter','user','admin'),
    upload.fields([ { name: 'image', maxCount: 1 }]),   editProfile);


userRouter.get('/get-profile', protectedRoutes, allowTo('waiter','user','admin'), getProfile);

userRouter.delete('/delete-acc', protectedRoutes, allowTo('waiter','user'), deleteAcc);




export default userRouter
