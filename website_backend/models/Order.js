const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    subscriptionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubscriptionPlan",
        required:true,
    },
    payment:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Payment",
    }],
      startDate:{
        type:Date,
      },
      endDate:{
        type:Date,
      },
      createdAt:{
        type:Date,
        default:Date.now,
      },
      updatedAt:{
        type:Date,
        default:Date.now,
      },
});

const Order = mongoose.model("Order",orderSchema);  

module.exports = Order;

