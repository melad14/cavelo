import { userModel } from "../../../databases/models/users.js"
import { AppErr } from "../../utils/AppErr.js"
import { catchAsyncErr } from "../../utils/catcherr.js"




export const addAdress = catchAsyncErr(async (req, res, next) => {
    const result = await userModel.findByIdAndUpdate(req.user._id, {$addToSet:{adresses:req.body}},{new:true})
    if (!result) return next(new AppErr(`you are not autherized`, 404))
    res.status(200).json({ "message": " success","statusCode":200 , result:result.adresses })
})

export const updateAddress = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params;
    
    const user = await userModel.findOneAndUpdate({ _id: req.user._id, "adresses._id": id },
         {
            $set: {
                "adresses.$": req.body
            }
        },
        { new: true }
    );

    if (!user) return next(new AppErr(`You are not authorized`, 404));

    res.status(200).json({ 
        "message": "Success", 
        "statusCode": 200, 
        "result": user.adresses 
    });
});

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


