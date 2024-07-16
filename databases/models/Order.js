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
  cancel: {
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


orderSchema.virtual('myReviews',{
  ref:'review',
  localField:'_id',
  foreignField :'order'
})

orderSchema.set('toJSON', { virtuals: true });

orderSchema.pre(/^find/,function(){
  this.populate('myReviews')
})

export const orderModel = mongoose.model('order', orderSchema)




