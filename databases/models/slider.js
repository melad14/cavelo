
import mongoose from "mongoose";
const sliderSchema = mongoose.Schema({
    image: {
        type: String,
        required: true
      },

}, { timestamps: true });

export const sliderModel = mongoose.model('slider', sliderSchema)