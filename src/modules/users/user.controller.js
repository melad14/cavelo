import jwt from "jsonwebtoken"
import { catchAsyncErr } from "../../utils/catcherr.js";
import { AppErr } from './../../utils/AppErr.js';
import { userModel } from "../../../databases/models/users.js";
import { sendSMSTest } from '../../emails/user.sms.js';


const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
};

const signin = catchAsyncErr(async (req, res, next) => {
    
    const { phone } = req.body;
    let user = await userModel.findOne({ phone });

    if (!user) {
        const user = new userModel({ phone })
        await user.save()

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60000); // OTP valid for 10 minutes
     const result=  await userModel.findOneAndUpdate({ phone }, { otp, otpExpires,code:0 },{new:true});
        await sendSMSTest(phone, `Your OTP is ${otp}`);
    
        res.status(200).json({ "message": "user created and OTP sent","statusCode":200 });
    }
else{
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60000); // OTP valid for 10 minutes
    const result= await userModel.findOneAndUpdate({ phone }, { otp, otpExpires,code:1 },{new:true});

    await sendSMSTest(phone, `Your OTP is ${otp}`);

    res.status(200).json({ "message": "OTP sent","statusCode":200,  });
}
   
});

const verifyOTP = catchAsyncErr(async (req, res, next) => {
    const { phone, otp } = req.body;
    let user = await userModel.findOne({ phone });

    if (!user || user.otp !== otp || new Date() > new Date(user.otpExpires)) {
        return next(new AppErr("Invalid or expired OTP", 400));
    }

    await userModel.updateOne({ phone }, { otp: null, otpExpires: null });

    let token = jwt.sign({ user }, `${process.env.TOKEN_SK}`);
    res.status(200).json({ "message": "success","statusCode":200 , token,result:user.code });
});


const completeProfile = catchAsyncErr(async (req, res, next) => {
    try {
        req.body.image = req.files['image']?.[0]?.path;
        const result = await userModel.findByIdAndUpdate(req.user._id, req.body, { new: true });
        if (!result) return next(new AppErr("failed to complete profile", 400)); // 400 for client error
        res.status(200).json({ "message": "success", "statusCode":200 ,result });
    } catch (error) {
        next(error);
    }
});

const editProfile = catchAsyncErr(async (req, res, next) => {
    const id = req.user._id
    if (req.files['image']?.[0]?.path) {
        req.body.image = req.files['image']?.[0]?.path;
    }
    const result = await userModel.findByIdAndUpdate(id, req.body, { new: true });

    res.status(200).json({ 'message': "success","statusCode":200 , result });
});

const getProfile = catchAsyncErr(async (req, res, next) => {
    const id = req.user._id
    const result = await userModel.findById(id)

    res.status(200).json({ "message": " success","statusCode":200 , result })
})



const deleteAcc = catchAsyncErr(async (req, res, next) => {

    const userId = req.user._id;

    const user = await userModel.findByIdAndDelete({ _id: userId });

    if (!user) return next(new AppErr("user not found or you are not authorized to delete this account", 400));

    res.status(200).json({ "message": "user deleted","statusCode":200  });

});





export {
    signin, verifyOTP,completeProfile, getProfile,
    editProfile, deleteAcc, 
}



