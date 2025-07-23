import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();  

export const connectDb = async() => {
    const mongoUri = process.env.MONGO_URL;
    try{
        await mongoose.connect(mongoUri);
        console.log("MongoDb connected successfully");
    }catch(err){
        console.log(err);
        // process.exit(1);
    }
};