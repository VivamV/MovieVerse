import mongoose from "mongoose"

const dbconnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB Database Not Connected:", error.message);
  }
};
export default dbconnection;
