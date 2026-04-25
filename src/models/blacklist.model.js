const mongoose = require('mongoose')

const blacklistTokenSchema = new mongoose.Schema({
    token:{
        type: String,
        unique: true,
        required: true,
        immutable: true

    }
},{
    timestamps : true
})

blacklistTokenSchema.index({createdAt: 1},{
    expireAfterSeconds: 60*60*24
}
)

const blacklistModel = mongoose.model('blacklist-token',blacklistTokenSchema)
module.exports = blacklistModel