const userModel = require('../models/user.models')
const jwt = require('jsonwebtoken')

async function userRegisterContoller (req,res){

    const {email, password, name} = req.body;

    const isExists = await userModel.findOne({email})

    if (isExists){
        return res.status(422).json({
            message: "User already exists with email",
            status: "failed"
        })
    }
    const user = await userModel.create({
        email,password,name
    })

    const token = jwt.sign({userId: user._id}, process.env.JWT_KEY, {expiresIn: '3d'})

    res.cookie('token', token)
    res.status(201).json({
        user:{
            _id : user._id,
            email: user.email,
            name: user.name
        }
    })

}

async function userLoginContoller (req,res) {

    const {email, password} = req.body

    const user = await userModel.findOne({email})
    
    if(!user) res.status(422).json({message: "User not found"})
    
    const isValidPassword = await user.comparePassword(password)

    if(!isValidPassword) res.status(422).json({ message: "Password not matching"})
    
    const token = jwt.sign({userId: user._id}, process.env.JWT_KEY, {expiresIn: '3d'})

    res.cookie('token', token)
    res.status(201).json({
             _id : user._id,
            email: user.email,
            name: user.name
    })

}


module.exports = {userRegisterContoller, userLoginContoller}