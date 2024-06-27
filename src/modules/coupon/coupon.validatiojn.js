import Joi from "joi"
 export const  createCouponSchema=Joi.object({  
     code:Joi.string().min(2).max(10).required(),
     discount:Joi.number().required(), 
     expire:Joi.date()
 })
 export const  getCouponSchema=Joi.object({  
      id:Joi.string().hex().length(24).required()
 })
 export const  updateCouponSchema=Joi.object({  
      id:Joi.string().hex().length(24).required(),
      code:Joi.string().min(2).max(10),
     discount:Joi.number(),
     expire:Joi.date()

 })