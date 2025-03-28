import mongoose from 'mongoose';

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO);
        console.log(`MongoDB Online`);
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
  }