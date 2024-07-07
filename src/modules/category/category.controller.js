
import { CategoryModel } from '../../../databases/models/Category.js';
import { AppErr } from '../../utils/AppErr.js';
import { catchAsyncErr } from '../../utils/catcherr.js';



export const createCategory = catchAsyncErr(async (req, res, next) => {
    
    const result = new CategoryModel(req.body)
    if (!result) return next(new AppErr('failed create category', 400))
    await result.save()
    res.status(201).json({ "message": "success","statusCode":200 , result })
})


export const getAllCategory = catchAsyncErr(async (req, res, next) => {

    const result = await CategoryModel.find()

    res.status(200).json({ "message": "success", "statusCode":200 ,result })
})


export const getCategory = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params
    const result = await CategoryModel.findById(id)
    res.status(201).json({ "message": "success","statusCode":200 , result })
})




export const updateCategory = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params
    const result = await CategoryModel.findByIdAndUpdate(id, req.body, { new: true })
    res.status(201).json({ "message": "success","statusCode":200 , result })
})


export const deleteCategory = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params
    const result = await CategoryModel.findByIdAndDelete(id)
    res.status(201).json({ "message": "success","statusCode":200 , result })
})

