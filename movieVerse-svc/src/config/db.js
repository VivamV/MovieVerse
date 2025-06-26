import mongoose from "mongoose"

const dbconnection = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/blogwebsite");
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Database Not Connected:", error.message);
  }
};
export default dbconnection;
