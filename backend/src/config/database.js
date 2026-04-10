import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    const source = process.env.MONGO_URI ? 'MONGO_URI' : 'MONGODB_URI';

    if (!mongoUri) {
      throw new Error('MONGO_URI is not configured');
    }

    console.log(`[DB] Connecting with ${source}`);
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
