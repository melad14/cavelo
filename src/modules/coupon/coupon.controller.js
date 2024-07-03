import QRCode from "qrcode";
import { catchAsyncErr } from "../../utils/catcherr.js";
import { AppErr } from "../../utils/AppErr.js";
import { coponModel } from './../../../databases/models/coupon.js';



export const createCopon = catchAsyncErr(async (req, res, next) => {
    const result = new coponModel(req.body)
    await result.save()
    res.status(201).json({ "message": " success","statusCode":200 , result })
})

export const getAllCopons = catchAsyncErr(async (req, res,next) => {
    const result = await coponModel.find()

    res.status(201).json({ "message": "success","statusCode":200 ,result })
})


export const getCopon = catchAsyncErr(async (req, res, next) => { 
    const { id } = req.params

    const result = await coponModel.findById(id)
    let url = await QRCode.toDataURL(result.code)
    if (!result) return next(new AppErr(`coupon not found`, 404))
    res.status(200).json({ "message": " success","statusCode":200 , result, url })
})


export const updateCopon = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params
    const result = await coponModel.findByIdAndUpdate(id, req.body, { new: true })
    if (!result) return next(new AppErr(`coupon not found or you are not autherized`, 404))
    res.status(200).json({ "message": " success","statusCode":200 , result })
})


export const deleteCopon = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params

    const result = await coponModel.findByIdAndDelete(id)
    !result && next(new AppErr('coupon not found', 404))
    result && res.status(201).json({ "message": "success" ,"statusCode":200 })
})

 
