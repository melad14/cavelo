import express from "express"
import { createCategory, deleteCategory, getAllCategory, getCategory, updateCategory } from "./category.controller.js"
import { allowTo, protectedRoutes } from "../../middleware/protectedRoute.js"

const categoryRouter =express.Router()



categoryRouter.post('/create-category',protectedRoutes,allowTo('user'),createCategory)
categoryRouter.get('/get-categories',getAllCategory)
categoryRouter.get('/get-category/:id',getCategory)
categoryRouter.put('/edit-category/:id',protectedRoutes,allowTo('user'),updateCategory)
categoryRouter.delete('/delete-category/:id',protectedRoutes,allowTo('user'),deleteCategory)

export default categoryRouter