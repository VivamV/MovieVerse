import mongoose from "mongoose";
const {Schema}=mongoose;

const userSchema = new Schema({
  fullname: {
    type: String,
    minLength: 3,
    required: [true]
},
  email: {
    type: String,
    required: [true],
    unique: true,
  },
  password: {
    type: String,
    required: [true],
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const userModel = mongoose.model('User', userSchema);
