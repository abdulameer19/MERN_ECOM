// Connection file to MongoDB
import mongoose, { ConnectOptions } from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        } as ConnectOptions); // Explicitly cast options to ConnectOptions
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;