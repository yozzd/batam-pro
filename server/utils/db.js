// server/utils/db.js

import mongoose from 'mongoose';

const config = useRuntimeConfig();

if (!config.mongodbUri) {
  throw new Error('Please define the NUXT_MONGODB_URI environment variable');
}

let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(config.mongodbUri, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
    console.info('MongoDB connected successfully');
    return cached.conn;
  }
  catch (error) {
    cached.promise = null;
    throw new Error(`MongoDB connection failed: ${error}`);
  }
}

export default connectDB;
