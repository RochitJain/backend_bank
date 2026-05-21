const joi = require('joi');

const transactionSchemaValidator = joi.object({
    toAccount : joi.string().required(),
    idempotencyKey : joi.string().required(),
    amount: joi.number().positive().required()
})

module.exports = transactionSchemaValidator