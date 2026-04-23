const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Account must be associated with the user'],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ['ACTIVE','FROZEN','CLOSED'],
            message: 'Status can Either be ACTIVE, FROZEN or CLOSED',
        },
        default: 'ACTIVE'
    },
    currency: {
        type: String,
        required: [true, 'amount needed for creating an account'],
        default : 'INR'

    }
}, {
        timestamps: true
    }
)

accountSchema.index({user: 1, status: 1})

const accountModel = mongoose.model('account',accountSchema)

module.exports = accountModel