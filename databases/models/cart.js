import mongoose from "mongoose";

const cartSchema = mongoose.Schema({

    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    cartItems: [{
        item: {
          type: mongoose.Types.ObjectId,
          ref: 'menu'
        },
        quantity: {
          type: Number,
          default: 1
        },
        basePrice: Number,
        size: {
          name: String,
          price: Number
        },
        extraIngredients: [{
          name: String,
          price: Number
        }]
      }],

    totalPrice: Number,

    totalPriceAfterDiscount: Number,

    discount: {
     type: Number,

    },

    terms: {
        type: [String],
    },




}, { timestamps: true })


export const cartModel = mongoose.model('cart', cartSchema)