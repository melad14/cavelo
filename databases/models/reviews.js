import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
    comment: {
        type: String,
        required: true,
        trim: true,
    },
    item: {
        type: mongoose.Types.ObjectId,
        ref: "menu"
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    }


}, { timestamps: true })

reviewSchema.pre(/^find/,function(){
    this.populate('user','first_name laset_name -_id')
})

export const reviewModel = mongoose.model('review', reviewSchema)