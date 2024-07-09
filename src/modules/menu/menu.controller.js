import { menuModel } from "../../../databases/models/MenuItem.js";
import { AppErr } from "../../utils/AppErr.js";
import { catchAsyncErr } from "../../utils/catcherr.js";


export const createItem = catchAsyncErr(async (req, res, next) => {

  if (req.files) {
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
  if (!result) return next(new AppErr('failed create item', 400))
  await result.save();
  res.status(200).json({ "message": "success", "statusCode": 200, result })
})


export const editItem = catchAsyncErr(async (req, res, next) => {
  const { id } = req.params

  if (req.files['image']?.[0]?.path) {
    req.body.image = req.files['image']?.[0]?.path
  }
  const result = await menuModel.findByIdAndUpdate(id, req.body, { new: true })
  if (!result) return next(new AppErr('failed update item', 400))

  res.status(200).json({ "message": "success", "statusCode": 200, result })
})

export const getAllMenu = catchAsyncErr(async (req, res, next) => {

  const result = await menuModel.find().select('image name basePrice description _id');

  res.status(200).json({ "message": "success", "statusCode": 200, result })
})

export const getAllMenuByCat = catchAsyncErr(async (req, res, next) => {

  const { category } = req.body
  const result = await menuModel.find({category}).select('image name basePrice description _id');
 
  res.status(200).json({ "message": "success", "statusCode": 200, result })
})


export const getitem = catchAsyncErr(async (req, res, next) => {
  const { id } = req.params
  const result = await menuModel.findById(id)

  res.status(200).json({ "message": "success", "statusCode": 200,  "result": [
    {
        "_id": "668a838c010d98f0a553bcdd",
        "image": "https://res.cloudinary.com/dh9gvhssv/image/upload/v1720353670/uploads/d7a23f52-ed28-4373-848e-7b09b2044445-IMG_20090102_223716_279.jpg.jpg",
        "name": "pizza",
        "description": "utyrewfe",
        "basePrice": 150
    },
    {
        "_id": "668a8425db834822f0bcea68",
        "image": "https://res.cloudinary.com/dh9gvhssv/image/upload/v1720353822/uploads/1636a041-c865-4e9f-b78d-8bcf58c38293-IMG_20090102_223716_279.jpg.jpg",
        "name": "pizza",
        "description": "utyrewfe",
        "basePrice": 150
    },
    {
        "_id": "668bb43335a056acece4c98f",
        "image": "https://res.cloudinary.com/dh9gvhssv/image/upload/v1720431666/uploads/c3f0eb38-0777-451b-bd50-5d34ea5db5c3-slider-masthead.jpg.jpg",
        "name": "pizza",
        "description": "utyrewfe",
        "basePrice": 150
    },
    {
        "_id": "668bb5fbcdb315688904beb5",
        "image": "https://res.cloudinary.com/dh9gvhssv/image/upload/v1720432123/uploads/e572d499-6146-49ac-8f92-1877195ac898-istockphoto-1070730232-612x612.jpg.jpg",
        "name": "pizza",
        "description": "utyrewfe",
        "basePrice": 150
    },
    {
        "_id": "668bd12fdec4d47d89be58ed",
        "image": "https://res.cloudinary.com/dh9gvhssv/image/upload/v1720439087/uploads/df2cbb43-4ff5-49a9-8e42-387597d31d33-6967288_Slider-Style-Mini-Burgers-4x3-ChefMo-738c3ba03b9640d4971f026eebf03fd4.jpg.jpg",
        "name": "pizza",
        "description": "utyrewfe",
        "basePrice": 150
    },
    {
        "_id": "668d279a0e0aca18e34243d3",
        "image": "https://res.cloudinary.com/dh9gvhssv/image/upload/v1720526741/uploads/41e43acd-32ce-42ce-a10a-ad594fb5ee21-output.png.jpg",
        "name": "pizza",
        "description": "utyrewfe",
        "basePrice": 150
    }
] })
})



export const deleteItem = catchAsyncErr(async (req, res, next) => {
  const { id } = req.params

  const result = await menuModel.findByIdAndDelete(id)
  result && res.status(200).json({ "message": "success", "statusCode": 200, result })
})



export const suggestItem = catchAsyncErr(async (req, res, next) => {
  const { id } = req.params;
  const result = await menuModel.findByIdAndUpdate(id, { suggested: true }, { new: true });
  if (!result) return next(new AppErr('Failed to suggest item', 400));

  res.status(200).json({ "message": "success", "statusCode": 200, result });
});

export const unsuggestItem = catchAsyncErr(async (req, res, next) => {
  const { id } = req.params;
  const result = await menuModel.findByIdAndUpdate(id, { suggested: false }, { new: true });
  if (!result) return next(new AppErr('Failed to unsuggest item', 400));

  res.status(200).json({ "message": "success", "statusCode": 200, result });
});

// Controller to get all suggested items
export const getSuggestedItems = catchAsyncErr(async (req, res, next) => {
  const result = await menuModel.find({ suggested: true }).select('image name basePrice description _id');
  if (!result) return next(new AppErr('No suggested items found', 404));

  res.status(200).json({ "message": "success", "statusCode": 200, result });
});
