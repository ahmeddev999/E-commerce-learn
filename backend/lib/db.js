import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDb is connected`);
    } catch (error) {
        console.log("Error connecting MongoDB", error.message);
        // agar 1 bet yani error bu agar 0 bu yani success bu
        process.exit(1);
    }
}