import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function check() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('No MONGODB_URI found in .env.local');
    process.exit(1);
  }
  
  console.log('Connecting to DB...');
  await mongoose.connect(uri);
  console.log('Connected.');
  
  const users = await User.find({});
  console.log('All users in DB:', users.map(u => ({ email: u.email, role: u.role })));
  
  const admin = await User.findOne({ email: 'admin@sandydigitalhub.com' });
  if (!admin) {
    console.log('admin@sandydigitalhub.com NOT FOUND');
  } else {
    console.log('admin@sandydigitalhub.com FOUND, role:', admin.role);
  }
  
  process.exit(0);
}

check().catch(console.error);
