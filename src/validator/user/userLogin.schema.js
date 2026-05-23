const Joi = require("joi");

const userLoginSchemaValidator = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().required().min(6).max(30).trim(),
});

module.exports = userLoginSchemaValidator;
