import { userModel } from "../../../databases/models/users.js";
import { AppErr } from "../../utils/AppErr.js";
import { catchAsyncErr } from "../../utils/catcherr.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const create_admin = catchAsyncErr(async (req, res, next) => {
    const { name,email, password,role } = req.body
    let user = await userModel.findOne({ email });

    if (user) return next(new AppErr("already exist", 501))
        const hash = bcrypt.hashSync(password, 7)
    let result = new userModel({name, email, password:hash ,role,confirm:true,})
    await result.save()
    res.status(200).json({ "message": " success","statusCode":200, result })

});

export const signIn_admin = catchAsyncErr(async (req, res, next) => {
    const { email, password } = req.body
    let user = await userModel.findOne({ email })
    if (!user || !await bcrypt.compare(password, user.password)) {
        return next(new AppErr("incorrect email or password", 501))
    }
    let token = jwt.sign({ user }, `${process.env.TOKEN_SK}`)
    res.json({ "message": "success","statusCode":200, token })

});



export const get_pic = catchAsyncErr(async (req, res, next) => {
    let id = req.user._id

    let admin = await userModel.findById(id)
    if (!admin) return next(new AppErr("account not found", 404))
    res.json({ "message": "success","statusCode":200, image: admin.image })

});

export const createUser = catchAsyncErr(async (req, res, next) => {
    const { phone, fullName } = req.body;
    let find = await userModel.findOne({ phone });

    if (find) return next(new AppErr("already exist", 501))

    const user = new userModel({ phone, fullName })
    await user.save()
    res.status(200).json({ "message": "user created ","statusCode":200, user });



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