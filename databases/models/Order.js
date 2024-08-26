import mongoose from "mongoose";
import crypto from "crypto"; 

const orderSchema = mongoose.Schema({
  orderNum: {
    type: String,
    unique: true, 

  },
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
    enum: ['indoor', 'delivery'],
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
  deliveryPerson: {
    type: String,
    default:""
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
  details: {
    type: String,
  },
  discount: {
    type: Number,
  },
}, { timestamps: true });

orderSchema.virtual('myReviews', {
  ref: 'review',
  localField: '_id',
  foreignField: 'order'
});

orderSchema.set('toJSON', { virtuals: true });

orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.orderNum = await generateUniqueOrderNum();
  }
  next();
});

async function generateUniqueOrderNum() {
  const orderNum = crypto.randomBytes(3).toString('hex').toUpperCase(); 
  const existingOrder = await mongoose.models.order.findOne({ orderNum });
  if (existingOrder) {
    return generateUniqueOrderNum(); 
  }
  return orderNum;
}

orderSchema.pre(/^find/, function () {
  this.populate('myReviews');
});

export const orderModel = mongoose.model('order', orderSchema);
