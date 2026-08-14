import mongoose from 'mongoose';

const connectDb = async () => {
    try {
       await  mongoose.connect(process.env.MONGODBURL);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
};

export default connectDb;
