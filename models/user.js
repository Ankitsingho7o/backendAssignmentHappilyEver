const mongoose = require("mongoose");

const userschema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    universityId:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },

    role:{
        type:String,
        enum:["Student","Dean"],
    },

});



module.exports = mongoose.model("user",userschema);