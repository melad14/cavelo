import mongoose from 'mongoose';

const ExtraPriceSchema = mongoose.Schema({
  name: String,
  price: Number,
});

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
    type: mongoose.Types.ObjectId,
    ref:'category'
  },
  basePrice: {
    type: Number
  },
  sizes: {
    type:[ExtraPriceSchema]
  },
  extraIngredientPrices: {
    type:[ExtraPriceSchema]
  },
}, {timestamps: true});

export const menuModel = mongoose.model('menu', menuSchema);





