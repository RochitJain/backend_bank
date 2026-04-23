const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email must be unique'],
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
        trim: true,
        lowercase: true,
    },
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlenght: [6, 'More than 6 is needed'],
    }
},{
    timestamps: true
})

userSchema.pre('save', async function(next){

    if(!this.isModified("password")) {
        return 
    }

    const hash = await bcrypt.hash(this.password,10)
    this.password = hash;
    return ;
})

userSchema.methods.comparePassword = async function (password) {
    
    return await bcrypt.compare(password,this.password);
    
}

const userModel = mongoose.model('user',userSchema);

module.exports = userModel