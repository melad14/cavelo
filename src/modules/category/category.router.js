import express from "express"
import { createCategory, deleteCategory, getAllCategory, getCategory, updateCategory } from "./category.controller.js"
import { allowTo, protectedRoutes } from "../../middleware/protectedRoute.js"

const categoryRouter =express.Router()



categoryRouter.post('/create-category',protectedRoutes,allowTo('admin'),createCategory)
categoryRouter.get('/get-categories',getAllCategory)
categoryRouter.get('/get-category/:id',getCategory)
categoryRouter.put('/edit-category/:id',protectedRoutes,allowTo('admin'),updateCategory)
categoryRouter.delete('/delete-category/:id',protectedRoutes,allowTo('admin'),deleteCategory)

export default categoryRouter