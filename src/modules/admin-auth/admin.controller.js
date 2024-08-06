import { userModel } from "../../../databases/models/users.js";
import { AppErr } from "../../utils/AppErr.js";
import { catchAsyncErr } from "../../utils/catcherr.js";
import jwt from 'jsonwebtoken';
import { sendSMSTest } from '../../emails/user.sms.js';


const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
};

export const create_account = catchAsyncErr(async (req, res, next) => {
    const { first_name,last_name,phone,role,email } = req.body
    let user = await userModel.findOne({ phone });
    if (user) return next(new AppErr("already exist", 501))

    let result = new userModel({first_name, last_name,phone ,role,email})
    await result.save()
    res.status(200).json({ "message": " success","statusCode":200, result })

});

export const signIn_admin = catchAsyncErr(async (req, res, next) => { 
    const { phone } = req.body
    let user = await userModel.findOne({ phone })
    if (!user || user.role!=="admin") {
        return next(new AppErr("incorrect phone or you are not authorized", 501))
     }
     const otp = generateOTP();
     const otpExpires = new Date(Date.now() + 10 * 60000);
     await userModel.findOneAndUpdate({ phone }, { otp, otpExpires }, { new: true });

     await sendSMSTest(phone, `Your OTP is ${otp}`);

     res.status(200).json({ "message": "OTP sent", "statusCode": 200, });


});


export const verifyOTP = catchAsyncErr(async (req, res, next) => {
    const { phone, otp } = req.body;
    let user = await userModel.findOne({ phone });

    if (!user || user.otp !== otp || new Date() > new Date(user.otpExpires)) {
        return next(new AppErr("Invalid or expired OTP", 400));
    }

    await userModel.updateOne({ phone }, { otp: null, otpExpires: null });

    let token = jwt.sign({ user }, `${process.env.TOKEN_SK}`);
    res.status(200).json({ "message": "success", "statusCode": 200, token});
});

export const getUsers = catchAsyncErr(async (req, res, next) => {

    const users = await userModel.find({role:"user" , blocked:false})

    res.status(200).json({ "message": "success","statusCode":200, users });

});
export const blockList = catchAsyncErr(async (req, res, next) => {

    const users = await userModel.find({role:"user" , blocked:true})

    res.status(200).json({ "message": "success","statusCode":200, users });

});

export const specificUser = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params;
    const user = await userModel.findById(id)

    res.status(200).json({ "message": "success","statusCode":200, user });

});

export const editUserRole = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params;
    const{role}=req.body
    const user = await userModel.findByIdAndUpdate(id,{role},{new:true})
    res.status(200).json({ "message": "success","statusCode":200, user });

});

export const blockUser = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params;
    const user = await userModel.findById(id);
  
    user.blocked = true;
    await user.save();
  
    res.status(200).json({ "message": "User blocked", "statusCode": 200 });
  });
  
export const unblockUser = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params;
    const user = await userModel.findById(id);
  
    user.blocked = false;
    await user.save();
  
    res.status(200).json({ "message": "User blocked", "statusCode": 200 });
  });
  