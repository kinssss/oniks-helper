import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://onixhelper:0000@cluster0.obpsp6q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    });
    console.log('✅ Connected to "test" database');
  } catch (error) {
    console.error('❌ Connection error:', error);
    process.exit(1);
  }
};

export default connectDB;

