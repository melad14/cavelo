import mongoose from "mongoose";
const userSchema = mongoose.Schema({
  name: {
    type: String
  },

  email: {
    type: String,
    unique: true
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
  streetAddress: {
    type: String
  },
  phone: {
    type: String,
    require:true,
    unique: true
  },
  image: {
    type: String
  },
adresses: [{
    city: String,
    street: String,
    phone: String
}],
  code: {  type: String}

}, { timestamps: true });

export const userModel = mongoose.model('user', userSchema)