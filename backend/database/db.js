import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection string - update <db_password> with actual password
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ryandang999_db_user:<db_password>@cluster0.izsxepp.mongodb.net/ems_inventory?retryWrites=true&w=majority&appName=Cluster0';

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, options);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    // Don't exit in production, let Vercel handle retries
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

// Don't auto-connect on import, let init script handle it
// connectDB();

export { connectDB };
export default mongoose;