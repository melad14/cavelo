import { menuModel } from "../../../databases/models/MenuItem.js";
import { AppErr } from "../../utils/AppErr.js";
import { catchAsyncErr } from "../../utils/catcherr.js";


export const createItem = catchAsyncErr(async (req, res, next) => {

    if( req.files['image']?.[0]?.path){
        req.body.image = req.files['image']?.[0]?.path
    }
      // Parse the sizes and extraIngredientPrices fields from JSON strings
  if (req.body.sizes) {
    try {
      req.body.sizes = JSON.parse(req.body.sizes);
    } catch (error) {
      return next(new AppErr('Invalid JSON format for sizes', 400));
    }
  }

  if (req.body.extraIngredientPrices) {
    try {
      req.body.extraIngredientPrices = JSON.parse(req.body.extraIngredientPrices);
    } catch (error) {
      return next(new AppErr('Invalid JSON format for extraIngredientPrices', 400));
    }
  }
    const result = new menuModel(req.body);
   if(!result) return  next(new AppErr('failed create item', 400))
    await result.save();
    res.status(200).json({ "message": "success","statusCode":200 , result })
})


export const editItem = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params

    if( req.files['image']?.[0]?.path){
        req.body.image = req.files['image']?.[0]?.path
    }
    const result = await menuModel.findByIdAndUpdate(id, req.body, { new: true })
    if(!result) return  next(new AppErr('failed update item', 400))

    res.status(200).json({ "message": "success","statusCode":200 , result })
})


export const getAllMenu = catchAsyncErr(async (req, res, next) => {

    const result = await menuModel.find()

    res.status(200).json({ "message": "success", "statusCode":200 ,result })
})


export const getitem = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params
    const result = await menuModel.findById(id)

    res.status(200).json({ "message": "success", "statusCode":200 ,result })
})



export const deleteItem = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params

    const result = await menuModel.findByIdAndDelete(id)
    result && res.status(200).json({ "message": "success" ,"statusCode":200 ,result})
})

