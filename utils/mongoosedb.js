import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

export const connectdb=async(req,res,next)=>{
    mongoose.connect(process.env.URL)
  .then(() => console.log('Connected!'));
}
