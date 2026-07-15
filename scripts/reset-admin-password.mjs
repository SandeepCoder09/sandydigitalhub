import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  password: String,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function reset() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('No MONGODB_URI found');
    process.exit(1);
  }
  
  await mongoose.connect(uri);
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await User.updateOne(
    { email: 'admin@sandydigitalhub.com' },
    { $set: { password: hashedPassword, role: 'ADMIN' } },
    { upsert: true }
  );
  
  console.log('Password reset to admin123 for admin@sandydigitalhub.com');
  process.exit(0);
}

reset().catch(console.error);
