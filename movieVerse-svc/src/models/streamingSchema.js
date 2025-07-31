import mongoose from "mongoose";
const {Schema}=mongoose;

const streamingUploadedMoviesSchema = new Schema({
  movieId: {
    type: String,
    required: true, // UUID
  },
  originalFullName: {
    type: String,
    required: true, // like "inception.mp4"
  },
  movieTitle: {
    type: String,
    required: true, 
  },
  
  first_air_date: {
    type: String,
    required: false,
  },
  poster_path: {
    type: String,
    required: false,
  },
  original_language: {
    type: String,
    required: false,
  },
  vote_average: {
    type: Number,
    required: false,
  },

  s3UploadRawLink: {
    type: String,
    required: true, 
  },
  s3UploadProcessedLink:{
    type: String,
    required: false
  },
    status:{
    type: String,
    required: false,
    default:"unprocessed"
  },//unprocessed,processing,processed,failed
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});


export const StreamingMoviesModel = mongoose.model('streamingUploadedMovies',  streamingUploadedMoviesSchema);