import { menuModel } from "../../../databases/models/MenuItem.js";
import { AppErr } from "../../utils/AppErr.js";
import { catchAsyncErr } from "../../utils/catcherr.js";


export const createItem = catchAsyncErr(async (req, res, next) => {
    const { image, name, description, category, basePrice, sizes, extraIngredientPrices } = req.body;
        
    const parsedSizes = JSON.parse(sizes);
    const parsedExtraIngredientPrices = JSON.parse(extraIngredientPrices);
    
    const result = new menuModel({
        image,
        name,
        description,
        category,
        basePrice,
        sizes: parsedSizes,
        extraIngredientPrices: parsedExtraIngredientPrices
    });
   if(!result) return  next(new AppErr('failed create item', 200))
    await result.save();
    res.status(200).json({ message: "success", result })
})

export const editItem = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params

    if( req.files['image']?.[0]?.path){
        req.body.image = req.files['image']?.[0]?.path
    }
    const result = await menuModel.findByIdAndUpdate(id, req.body, { new: true })
    if(!result) return  next(new AppErr('failed update item', 200))

    res.status(200).json({ message: "success", result })
})


export const getAllMenu = catchAsyncErr(async (req, res, next) => {

    const result = await menuModel.find()

    res.status(200).json({ message: "success", result })
})


export const getitem = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params
    const result = await menuModel.findById(id)

    res.status(200).json({ message: "success", result })
})



export const deleteItem = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params

    const result = await menuModel.findByIdAndDelete(id)
    result && res.status(201).json({ message: "success" ,result})
})

