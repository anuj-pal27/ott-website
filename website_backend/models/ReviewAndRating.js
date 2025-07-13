const mongoose = require("mongoose");

const reviewAndRatingSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5,
    },
    review:{
        type:String,
    },
})

module.exports = mongoose.model("ReviewAndRating",reviewAndRatingSchema);