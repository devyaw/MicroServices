import mongoose from "mongoose";

 const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODBURL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
 }

export default connectMongoDB;
