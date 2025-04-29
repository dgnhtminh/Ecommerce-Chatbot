const mongoose = require("mongoose");

// Schema creating for User model
const Users = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true, 
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
        default: {},
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

module.exports = mongoose.model('Users', Users);