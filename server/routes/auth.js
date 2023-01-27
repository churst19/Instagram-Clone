const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const {JWT_SECRET} = require('../keys')
const dotenv = require('dotenv')
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET
const requireLogin = require('../middleware/requireLogin')


router.get('/',(req,res)=>{
    res.send("hello")
})

//should be accessible only when user has correct token
//middleware calls requireLogin to verify user
router.get('/protected', requireLogin, (req,res) => {
    res.send("Hello User")
})

router.post('/signup',(req,res) => {
    const {name,email,password,pic} = req.body
    if(!name || !email || !password){
        return res.status(422).json({error:"please add all of the fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        //if already exists
        if(savedUser){
            return res.status(422).json({error:"user already exists with that email"})
        }
        //if doesn't exist
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user = new User({
                name,
                email,
                password:hashedpassword,
                pic:pic
            })
    
            user.save()
            .then(user=>{
                res.json({message:"saved successfully"})
            })
            .catch(err=>{
                console.log(err)
            })
    
            
        })
        
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/signin', (req, res) => {
    const {email, password} = req.body
    if (!email || !password){
        return res.status(422).json({error:"Please provide email or password"})
    }
    User.findOne({email:email})
    .then(savedUser => {
        //if you didn't find a user
        if(!savedUser){
            return res.status(422).json({error:"Invalid email or password"})
        }
        //if you found a user
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            //if password matches
            if (doMatch){
                //res.json({message:"Successly signed in"})
                //generate jwt and respond with it
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email,followers,following,pic} = savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}})
            }else{
                //if password doesn't match
                return res.status(422).json({error:"Invalid email or password"})
            }
        })
        .catch(err => {
            console.log(err)
        })
    })
})

module.exports = router