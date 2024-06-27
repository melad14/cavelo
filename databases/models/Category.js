import mongoose from "mongoose";

const categorySchema=mongoose.Schema({
    name:{
        type:String,
        unique:[true,'category name is required'],
        require:true,
    },
    image:String

},{timestamps:true})


export const CategoryModel=new mongoose.model('category',categorySchema)