import { userModel } from "../../../databases/models/users.js";
import { AppErr } from "../../utils/AppErr.js";
import { catchAsyncErr } from "../../utils/catcherr.js";
import jwt from 'jsonwebtoken';


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
    if (!user) {
        return next(new AppErr("incorrect phone ", 501))
    }
    let token = jwt.sign({ user }, `${process.env.TOKEN_SK}`)
    res.json({ "message": "success","statusCode":200, token })

});


export const getUsers = catchAsyncErr(async (req, res, next) => {

    const users = await userModel.find()

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