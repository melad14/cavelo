import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'user'
  },

  cartItems: [{
    item: {
      type: mongoose.Types.ObjectId,
      ref: 'menu'
    },
    quantity: Number,
    basePrice: Number
  }],

  totalOrderPrice: Number,

  shippingAddress: {
    street: String,
    city: String,
    phone: String,
    secondPhone: String,
  },

  deliveryOption: {
    type: String,
    enum: ['indoor', 'delevery'],
  },
  tableNumber: {
    type: Number,
  },

  paymentmethod: {
    type: String,
    enum: ['card', 'cash'],
    default: 'cash'
  },

  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: Date,

  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: Date,


  iscomplete: {
    type: Boolean,
    default: false
  },
  assignedDeliveryPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  details: {
    type: String,
  }

}, { timestamps: true })


export const orderModel = mongoose.model('order', orderSchema)




