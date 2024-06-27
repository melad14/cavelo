import { userModel } from "../../../database/models/user.js"
import { catchAsyncErr } from "../../middleware/catchErr.js"
import { AppError } from "../../utils/AppErr.js"



export const addAdress = catchAsyncErr(async (req, res, next) => {
    const result = await userModel.findByIdAndUpdate(req.user._id, {$addToSet:{adresses:req.body}},{new:true})
    if (!result) return next(new AppError(`you are not autherized`, 404))
    res.status(200).json({ "message": " success", result:result.adresses })
})

export const removeAdress = catchAsyncErr(async (req, res, next) => {
    const result = await userModel.findByIdAndUpdate(req.user._id, {$pull:{adresses:{_id:req.body.address}}},{new:true})
    if (!result) return next(new AppError(` you are not autherized`, 404))
    res.status(200).json({ "message": " success", result:result.adresses })
})


export const getAllAdresses = catchAsyncErr(async (req, res, next) => {
    const result = await userModel.findOne({_id:req.user._id}).populate('adresses')
    if (!result) return next(new AppError(` you are not autherized`, 401))
    res.status(200).json({ "message": " success", result:result.adresses })
})


 