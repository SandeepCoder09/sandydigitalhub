/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define MONGODB_URI in .env.local");
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");
    
    const email = 'admin@sandydigitalhub.com';
    const password = 'admin123';
    
    // Check if admin exists
    let admin = await User.findOne({ email });
    
    if (admin) {
      console.log("Admin already exists!");
      
      // Update password just in case
      const hashedPassword = await bcrypt.hash(password, 10);
      admin.password = hashedPassword;
      admin.role = 'ADMIN';
      await admin.save();
      
      console.log(`Admin updated! Email: ${email}, Password: ${password}`);
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await User.create({
        name: 'Super Admin',
        email,
        password: hashedPassword,
        role: 'ADMIN'
      });
      
      console.log(`Admin created successfully! Email: ${email}, Password: ${password}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
