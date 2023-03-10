const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
// const dotenv = require('dotenv')
// require('dotenv').config()
// const JWT_SECRET = process.env.JWT_SECRET
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req, res, next) => {
    const {authorization} = req.headers
    //authorization === Bearer aslkjdflk_token_kjahsdfkjh
    if(!authorization){
        return res.status(401).json({error:"You must be logged in"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err){
            return res.status(401).json({error:"You must be logged in"})
        }

        const{_id} = payload
        User.findById(_id).then(userdata => {
            req.user = userdata
            next()

        })
    })
}