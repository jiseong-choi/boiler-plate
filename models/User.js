const mongoose = require('mongoose');
const userSchema = mongoose.Schema({// Schema declares type of its value.
    name:{
        type:String,
        maxLength:50,
    },
    email:{
        type:String,
        trim:true,
        unique:1,
    },
    password:{
        type:String,
        minlength:5
    },
    lastName:{
        type:String,
        maxLength:50,
    },
    role:{
        type:Number,
        default:0
    },
    image:String,
    token:{
        type:String,
    },
    tokenExp:{
        type:Number
    }
})

const User = mongoose.model('User',userSchema)

module.exports = { User }