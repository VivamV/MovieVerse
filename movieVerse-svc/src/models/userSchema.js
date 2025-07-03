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

const bookingSchema = new Schema({
  movieId: {
    type: String,
    required: true,
  },
  movieTitle: {
    type: String,
    required: true,
  },
  theatreId:{
    type: String,
    required: true,
  },
  theatreName: {
    type: String,
    required: true,
  },
  seats: {
    type: [String], // e.g., ['A1', 'A2']
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
  },
  city:{
    type:String,
    required:true
  },
  showTime: {
    type: String,
    required: true,
  },
    date: {
    type: String,
    required: true,
  },
  // mediaType: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const BookingModel = mongoose.model('Booking', bookingSchema);

// const postSchema = new Schema({
//   movieId:{
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required:true
//   },
//     imageURL: {
//       type: String,
//     },
//     caption: {
//       type: String,
//       required:true
//     },
   
//     likes: [{
//       type: Schema.Types.ObjectId,
//       ref: 'User'
//     }],
//     createdAt: {
//       type: Date,
//       default: Date.now
//     }
//   });
// export const postsModel = mongoose.model('Post', postSchema);