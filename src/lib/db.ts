/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// --- Mongoose Global Cached Connection for Serverless Environments ---
const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  // If already connected and cached, return existing connection immediately
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise || mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5s timeout to fail fast rather than hanging
      socketTimeoutMS: 30000,
      maxPoolSize: 10, // Optimized for serverless concurrency
      minPoolSize: 2,  // Keep warm pool ready
      autoIndex: process.env.NODE_ENV !== 'production', // Build indexes only in dev/build, never in live production requests
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      return m;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    throw e;
  }

  return cached.conn;
};

// --- Local JSON Storage (For Blog & Legacy Code) ---
const dataDir = path.join(process.cwd(), 'src/data');

export const readData = (filename: string) => {
  try {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const fileData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

export const writeData = (filename: string, data: any) => {
  try {
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};
