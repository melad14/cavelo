import express from 'express'
import { completeProfile, editProfile, getProfile ,deleteAcc, signin, verifyOTP} from './user.controller.js';
import { allowTo, protectedRoutes } from '../../middleware/protectedRoute.js';
import { upload } from '../../utils/fileUp.js';





let userRouter = express.Router();



userRouter.post('/signin',  signin);
userRouter.post('/verify',  verifyOTP);

userRouter.put('/complete-profile', protectedRoutes, allowTo('user'),
    upload.fields([{ name: 'image', maxCount: 1 } ]), completeProfile);


userRouter.put('/edit-profile', protectedRoutes, allowTo('user'),
    upload.fields([ { name: 'image', maxCount: 1 }]),   editProfile);


userRouter.get('/get-profile', protectedRoutes, allowTo('user'), getProfile);

userRouter.delete('/delete-acc', protectedRoutes, allowTo('user'), deleteAcc);




export default userRouter
