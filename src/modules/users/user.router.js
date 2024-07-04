import express from 'express'
import { completeProfile, editProfile, getProfile ,deleteAcc, signin, verifyOTP} from './user.controller.js';
import { allowTo, protectedRoutes } from '../../middleware/protectedRoute.js';
import { upload } from '../../utils/fileUp.js';
import { validation } from './../../middleware/validation.js';
import { signInSchema, verifySchema } from './user.validation.js';





let userRouter = express.Router();



userRouter.post('/signin',validation(signInSchema)  ,signin);
userRouter.post('/verify', validation(verifySchema) , verifyOTP);

userRouter.post('/complete-profile', protectedRoutes, allowTo('user'), completeProfile);


userRouter.put('/edit-profile', protectedRoutes, allowTo('user'),
    upload.fields([ { name: 'image', maxCount: 1 }]),   editProfile);


userRouter.get('/get-profile', protectedRoutes, allowTo('user'), getProfile);

userRouter.delete('/delete-acc', protectedRoutes, allowTo('user'), deleteAcc);




export default userRouter
