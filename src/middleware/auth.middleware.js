const userModel = require('../models/user.models')
const jwt = require('jsonwebtoken')

async function authMiddleware(req, res, next) {
    try{
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

        if(!token){
            res.status(401).json({
                message: "User not authorized"
            })
        }

        const id = jwt.verify(token, process.env.JWT_KEY)
        const userData = await userModel.findById(id.userId)

        req.user = userData
        next()


    }catch(err) {
        res.status(401).json({message: err.message})
    }
}

module.exports = {authMiddleware}