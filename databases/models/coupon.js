import mongoose from "mongoose";

const coponSchema=mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true    },
    discount: {
        type: Number,
        required: [true,'coupon discount is required'],
        min: 0,
    },
    expire:{
        type:Date,
        required:true
       }
},{timestamps:true})

export const coponModel=mongoose.model('copon',coponSchema)