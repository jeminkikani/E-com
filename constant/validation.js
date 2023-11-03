const Joi = require("joi");

module.exports.validator = {
  FIRSTNAME: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .pattern(new RegExp("^[a-zA-Z]+$"))
    .messages({
      "string.pattern.base": "Firstname must only contain characters",
    }),

  LASTNAME: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .pattern(new RegExp("^[a-zA-Z]+$"))
    .messages({
      "string.pattern.base": "Lastname must only contain characters",
    }),

  EMAIL: Joi.string().trim().email().required().messages({
    "string.email": "email is not allowed",
  }),

  PASSWORD: Joi.string().trim().min(4).required().messages({
    "string.min": "Password must be at least 4 characters long",
  }),

  CONFIRM_PASSWORD: Joi.string().trim().min(4).required().messages({
    "string.min": "Password must be at least 4 characters long",
  }),

//   ROLE: Joi.string()
//     .trim()
//     .valid("Seller")
//     .required()
//     .messages({
//       "any.only": "Invalid role",
//     }),
};
