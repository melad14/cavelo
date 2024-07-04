import express from 'express'
import { allowTo, protectedRoutes } from '../../middleware/protectedRoute.js';
import { upload } from '../../utils/fileUp.js';
import { addSliderImage, deleteSliderImage, getAllSliderImages } from './slider.controller.js';


let sliderRouter = express.Router();


sliderRouter.post('/add-slider', protectedRoutes, allowTo('admin'),
    upload.fields([{ name: 'image', maxCount: 1 } ]), addSliderImage);

sliderRouter.get('/get-slider', protectedRoutes, allowTo('admin'),getAllSliderImages);

sliderRouter.delete('/delete-slider/:id', protectedRoutes, allowTo('admin'),deleteSliderImage);




export default sliderRouter
