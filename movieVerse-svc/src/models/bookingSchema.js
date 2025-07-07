import mongoose from "mongoose";
const {Schema}=mongoose;

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
    type: [String], 
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