import Joi from "joi"
export const addressSchema = Joi.object({
     city: Joi.string().required(),
     street: Joi.string().required(),
     phone: Joi.string().required()
})

export const addressRemoveSchema = Joi.object({
     address: Joi.string().required()
});
