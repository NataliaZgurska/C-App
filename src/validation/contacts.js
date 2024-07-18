import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Contactname should be a string',
    'string.min': 'Contactname should have at least {#limit} characters',
    'string.max': 'Contactname should have at most {#limit} characters',
    'any.required': 'Contactname is required',
  }),

  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.min': 'Contactnumber should have at least {#limit} characters',
    'string.max': 'Contactnumber should have at most {#limit} characters',
    'any.required': 'Contactnumber is required',
  }),

  userId: Joi.string(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Contactname should be a string',
    'string.min': 'Contactname should have at least {#limit} characters',
    'string.max': 'Contactname should have at most {#limit} characters',
  }),

  phoneNumber: Joi.string().min(3).max(20).messages({
    'string.min': 'Contactnumber should have at least {#limit} characters',
    'string.max': 'Contactnumber should have at most {#limit} characters',
  }),

  userId: Joi.string(),
});
