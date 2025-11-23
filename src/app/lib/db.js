import mongoose from "mongoose";

let isConnected = false;

const connectToMongoDB = async () => {
    // If already connected, return early
    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }

    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        console.log("Connecting to MongoDB...");
        
        // Connection options for better reliability
        const options = {
            serverSelectionTimeoutMS: 10000, // 10 seconds timeout
            socketTimeoutMS: 45000, // 45 seconds socket timeout
            connectTimeoutMS: 10000, // 10 seconds connection timeout
            maxPoolSize: 10, // Maintain up to 10 socket connections
            minPoolSize: 5, // Maintain at least 5 socket connections
            retryWrites: true,
            w: 'majority'
        };

        const conn = await mongoose.connect(process.env.MONGO_URI, options);
        isConnected = true;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
            isConnected = false;
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
            isConnected = true;
        });
    } catch (error) {
        console.error("MongoDB connection error:", error);
        isConnected = false;
        
        // Provide helpful error messages
        if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
            throw new Error(
                "MongoDB connection refused. Please check:\n" +
                "1. MongoDB Atlas cluster is running (not paused)\n" +
                "2. Your IP address is whitelisted in MongoDB Atlas Network Access\n" +
                "3. Your internet connection is working\n" +
                "4. Try using the standard connection string format if SRV fails"
            );
        }
        
        // Don't exit process in Next.js API routes, just throw the error
        throw error;
    }
};

export default connectToMongoDB;