const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    paymentMethod:{
        type:String,
        enum:["card","upi","cash","phonepe"],
        default:"card",
    },
    paymentStatus:{
        type:String,
        enum:["pending","success","failed"],
        default:"pending",
    },
    paymentId:{
        type:String,
    },
    paymentDate:{
        type:Date,
        default:Date.now,
    },
    paymentAmount:{
        type:Number,
    },
    paymentCurrency:{
        type:String,
        default:"INR",
    },
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order",
        required:true,
    },
})

module.exports = mongoose.model("Payment",paymentSchema);
