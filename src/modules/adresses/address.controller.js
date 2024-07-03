import { userModel } from "../../../databases/models/users.js"
import { AppErr } from "../../utils/AppErr.js"
import { catchAsyncErr } from "../../utils/catcherr.js"




export const addAdress = catchAsyncErr(async (req, res, next) => {
    const result = await userModel.findByIdAndUpdate(req.user._id, {$addToSet:{adresses:req.body}},{new:true})
    if (!result) return next(new AppErr(`you are not autherized`, 404))
    res.status(200).json({ "message": " success","statusCode":200 , result:result.adresses })
})

export const removeAdress = catchAsyncErr(async (req, res, next) => {
    const result = await userModel.findByIdAndUpdate(req.user._id, {$pull:{adresses:{_id:req.body.address}}},{new:true})
    if (!result) return next(new AppErr(` you are not autherized`, 404))
    res.status(200).json({ "message": " success","statusCode":200 , result:result.adresses })
})


export const getAllAdresses = catchAsyncErr(async (req, res, next) => {
    const result = await userModel.findOne({_id:req.user._id}).populate('adresses')
    if (!result) return next(new AppErr(` you are not autherized`, 401))
    res.status(200).json({ "message": " success","statusCode":200 , result:result.adresses })
})


