import Joi from "joi"
export const createReviewSchema = Joi.object({
     comment: Joi.string().required(),
     product: Joi.string().hex().length(24).required(),
     rating: Joi.number()
})
export const getReviewSchema = Joi.object({
     id: Joi.string().hex().length(24).required()
})
export const updateReviewSchema = Joi.object({
     id: Joi.string().hex().length(24),
     comment: Joi.string().required(),
     rating: Joi.number()

})