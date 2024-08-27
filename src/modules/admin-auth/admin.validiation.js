import Joi from 'joi';


const egyptianPhoneNumberPattern = /^20(1[0-9]{9})$/;

export const signInSchema = Joi.object({
  phone: Joi.string().pattern(egyptianPhoneNumberPattern).required(),
  subscriptionId:Joi.string(),
});

export const verifySchema = Joi.object({
    phone: Joi.string().pattern(egyptianPhoneNumberPattern).required(),
    otp: Joi.string().length(6).required(),
  
  });
  