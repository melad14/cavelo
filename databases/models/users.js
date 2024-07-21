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
    unique: true,
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
    enum: ["user", "admin","delivery"],
    default: 'user'
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
    city: String,
    street: String,
    flat: String
}],
  code: {  
    type:Number,
    }

}, { timestamps: true });

export const userModel = mongoose.model('user', userSchema)