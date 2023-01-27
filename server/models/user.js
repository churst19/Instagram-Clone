const mongoose = require('mongoose')    
const {ObjectId} =mongoose.Schema.Types


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    pic:{
      type: String,
      default: "https://res.cloudinary.com/dw4yp0jcv/image/upload/v1674672494/no-profile-picture-15257_k6nzia.png"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
})


mongoose.model("User",userSchema)