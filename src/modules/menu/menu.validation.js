 
import Joi from "joi"

export const  createProductSchema=Joi.object({  
     name:Joi.string().min(2).max(20).required(),
     description:Joi.string().min(2).max(300).required(),
     category:Joi.string().hex().length(24).required(),
     subcategory:Joi.string().hex().length(24).required(),
     brand:Joi.string().hex().length(24).required(),
     price:Joi.number().required(),
     quantity:Joi.number().required(),
     priceAfterDiscount:Joi.number(),
     ratingAvg:Joi.number(),
     sold:Joi.number(),
     ratingCount:Joi.number()
})
export const  getProductSchema=Joi.object({  
     id:Joi.string().hex().length(24).required()
})

export const  updateProductSchema=Joi.object({  
     id:Joi.string().hex().length(24).required(),
     name:Joi.string().min(2).max(20),
     description:Joi.string().min(2).max(300),
     category:Joi.string().hex().length(24),
     subcategory:Joi.string().hex().length(24),
     brand:Joi.string().hex().length(24),
     price:Joi.number(),
     quantity:Joi.number(),
     priceAfterDiscount:Joi.number(),
     ratingAvg:Joi.number(),
     sold:Joi.number(),
     ratingCount:Joi.number()


})
