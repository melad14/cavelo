import mongoose from 'mongoose';

const offerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  items: [{
    type: mongoose.Types.ObjectId,
    ref: 'menu'
  }],
  discount: {
    type: Number, 
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
}, { timestamps: true });

export const offerModel = mongoose.model('offer', offerSchema);
