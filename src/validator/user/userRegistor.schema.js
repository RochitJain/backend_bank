const Joi = require("joi")

    const userRegisterSchemaValidator = Joi.object({
        email: Joi.string().email().required().lowercase().trim(),
        password: Joi.string().required().min(6).max(30),
        name: Joi.string().required().trim().max(30)
    })


module.exports = userRegisterSchemaValidator