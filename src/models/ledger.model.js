const mongoose = require('mongoose')

const ledgerSchema = new mongoose.Schema({
    account: {
        type: String,
        ref: 'account',
        required: [true, 'account needed'],
        immutable: true,
        index: true
    },
    amount: {
        type: Number,
        required: [true, 'amount needed'],
        immutable: true,
    },
    transaction:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transaction',
        index: true,
        required: [true, 'transaction id needed'],
        immutable: true
    },
    type: {
        type: String,
        enum:{
            values: ['CREDIT','DEBIT'],
            message: 'Either credit or debit'
        },
        required: true,
        immutable: true
    }
}, {
    timestamps: true
});

function immutableError() {
    throw new Error('Ledger entries cannot be modified');
}

ledgerSchema.pre('updateMany', immutableError);
ledgerSchema.pre('deleteMany', immutableError);
ledgerSchema.pre('deleteOne', immutableError);
ledgerSchema.pre('findOneAndDelete', immutableError);
ledgerSchema.pre('findOneAndUpdate', immutableError);
ledgerSchema.pre('remove', immutableError);
ledgerSchema.pre('updateOne', immutableError);
ledgerSchema.pre('findOneAndReplace', immutableError)

const ledgerModel = mongoose.model('ledger', ledgerSchema);

module.exports = ledgerModel