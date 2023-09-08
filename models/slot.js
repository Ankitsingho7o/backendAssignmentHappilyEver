const mongoose = require("mongoose");

const slotSchema = mongoose.Schema({
   
    day:{
        type:String,
        enum:["thursday","friday"],
        required:true,
    },
    startTime:{
        type:Number,
        required:true
    },
    endTime:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["available","booked"],
        required:true,
    },
    
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    teacher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    

});

module.exports = mongoose.model("slot",slotSchema);