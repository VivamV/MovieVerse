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
profileimageURL: {
  type: String,
},
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const userModel = mongoose.model('User', userSchema);

const postSchema = new Schema({
  user:{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required:true
  },
    imageURL: {
      type: String,
    },
    caption: {
      type: String,
      required:true
    },
   
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
export const postsModel = mongoose.model('Post', postSchema);



