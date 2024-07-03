import express from "express"
import { createReview, deleteReview, getAllReviews, getReview, updateReview } from "./review.controller.js"
import { allowTo, protectedRoutes } from "../../middleware/protectedRoute.js";

const reviewRouter = express.Router()

reviewRouter.post('/create-review',protectedRoutes,allowTo( 'user'),createReview)
reviewRouter.get('/get-all-review',getAllReviews)
reviewRouter.get('/get-review/:id',getReview)
reviewRouter.put('/update-review/:id',protectedRoutes,allowTo('user'),updateReview)
reviewRouter.delete('/delete-review/:id',protectedRoutes,allowTo('user','admin'),deleteReview)


export default reviewRouter