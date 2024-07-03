import { AppErr } from "../../utils/AppErr.js";
import { catchAsyncErr } from "../../utils/catcherr.js";
import { reviewModel } from './../../../databases/models/reviews.js';



export const createReview = catchAsyncErr(async (req, res, next) => {
     req.body.user=req.user._id

     let isReview=await reviewModel.findOne({user:req.user._id,item:req.body.item})
     if(isReview)return  next(new AppErr(`you already made a review about this item`, 401))

    const result = new reviewModel(req.body)
    await result.save()
    res.status(200).json({ "message": " success","statusCode":200, result })
})


export const getAllReviews = catchAsyncErr(async (req, res,next) => {
    const result = await reviewModel.find()
    res.status(200).json({ "message": " success","statusCode":200,result })
})


export const getReview = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params
    const result = await reviewModel.findById(id)
    if (!result) return next(new AppErr(`Review not found`, 404))
        
    res.status(200).json({ "message": " success","statusCode":200, result })
})


export const updateReview = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params
    const result = await reviewModel.findOneAndUpdate({ _id: id, user: req.user._id }, req.body, { new: true })
    if (!result) return next(new AppErr(`Review not found or you are not autherized`, 404))
    res.status(200).json({ "message": " success","statusCode":200, result })
})


export const deleteReview = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params
    const result = await reviewModel.findByIdAndDelete({ _id: id, user: req.user._id })
    !result && next(new AppErr('review not found', 404))
    result && res.status(200).json({ "message": "success", "statusCode":200})
})

