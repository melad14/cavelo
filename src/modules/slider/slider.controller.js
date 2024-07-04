
import { sliderModel } from "../../../databases/models/slider.js";
import { AppErr } from "../../utils/AppErr.js";
import { catchAsyncErr } from "../../utils/catcherr.js";

export const addSliderImage = catchAsyncErr(async (req, res, next) => {

    if( req.files['image']?.[0]?.path){
        req.body.image = req.files['image']?.[0]?.path
    }
    const newImage = {
      image: req.files['image'][0].path,  };
  
    const result = new sliderModel(newImage);
    await result.save();
    res.status(200).json({ "message": "success", "statusCode": 200, result });
  });
  

  export const getAllSliderImages = catchAsyncErr(async (req, res, next) => {
    const result = await sliderModel.find();
    res.status(200).json({ "message": "success", "statusCode": 200, result });
  });
  

  export const deleteSliderImage = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params;
    const result = await sliderModel.findByIdAndDelete(id);
    if (!result) return next(new AppErr('Image not found', 404));
  
    res.status(200).json({ "message": "success", "statusCode": 200, result });
  });