import mongoose from "mongoose";
const userSchema = mongoose.Schema({
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },

  email: {
    type: String,
  },
  
  gender: {
    type: String,
    default:""
  },

  dateOfBirth: {
    type: String,
    default:""
  },

  otp: {
    type: String,
  },

  otpExpires: {
    type: Date,
  },
  role: {
    type: String,
    enum: ["user", "admin","delivery","waiter"],
    default: 'user'
  },
  blocked: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    require:true,
    unique: true
  },
  image: {
    type: String,
    default:''
  },
adresses: [{
  street: String,
  city: String,
  phone: String,
  secondPhone: String,
}],
  code: {  
    type:Number,
    },

    subscriptionId:{
      type:String
    }

}, { timestamps: true });

export const userModel = mongoose.model('user', userSchema)