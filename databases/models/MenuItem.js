import mongoose from 'mongoose';

const menuSchema = mongoose.Schema({
  image: {
    type: String
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  category: {
    type: String,
  },
  
  basePrice: {
    type: Number
  },
  sizes: {
    type:[{
      name: String,
      price: Number,
    }]
  },
  extraIngredientPrices: {
    type:[{
      name: String,
      price: Number,
    }]
  },
  suggested: {
    type: Boolean,
    default: false
  }

}, {timestamps: true});

export const menuModel = mongoose.model('menu', menuSchema);





