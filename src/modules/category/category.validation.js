 
import Joi from "joi"
 export const  createCatSchema=Joi.object({  
      name:Joi.string().min(2).max(20).required()
 })

 export const  getCatSchema=Joi.object({  
      id:Joi.string().hex().length(24).required()
 })

 export const  updateCatSchema=Joi.object({  
      id:Joi.string().hex().length(24).required(),
      name:Joi.string().min(2).max(20)

 })
