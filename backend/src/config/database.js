import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const primaryMongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    const fallbackMongoUri = 'mongodb://127.0.0.1:27017/trendcart_auth_demo';
    const source = process.env.MONGO_URI ? 'MONGO_URI' : 'MONGODB_URI';

    if (!primaryMongoUri) {
      throw new Error('MONGO_URI is not configured');
    }

    console.log(`[DB] Connecting with ${source}`);
    let conn;

    try {
      conn = await mongoose.connect(primaryMongoUri);
    } catch (primaryError) {
      console.warn(`[DB] Primary connection failed: ${primaryError.message}`);
      console.warn('[DB] Trying local fallback database for development');
      conn = await mongoose.connect(fallbackMongoUri);
    }

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
