/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define MONGODB_URI in .env.local");
  process.exit(1);
}

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now },
});

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

const services = [
  {
    title: "Photocopy (B&W)",
    description: "High-quality black and white photocopy (A4 size).",
    price: 2,
    category: "Printing & Copying",
    image: "https://images.unsplash.com/photo-1562564055-71e051d33c19?w=800&q=80",
    status: "ACTIVE"
  },
  {
    title: "Photocopy (Color)",
    description: "High-quality color photocopy (A4 size).",
    price: 10,
    category: "Printing & Copying",
    image: "https://images.unsplash.com/photo-1562564055-71e051d33c19?w=800&q=80",
    status: "ACTIVE"
  },
  {
    title: "Document Printing (B&W)",
    description: "Laser printout of documents in black and white.",
    price: 5,
    category: "Printing & Copying",
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80",
    status: "ACTIVE"
  },
  {
    title: "Document Printing (Color)",
    description: "High-resolution color printout of documents.",
    price: 15,
    category: "Printing & Copying",
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80",
    status: "ACTIVE"
  },
  {
    title: "PAN Card (New Application)",
    description: "Apply for a new PAN card with complete assistance.",
    price: 250,
    category: "Government Services",
    image: "https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?w=800&q=80",
    status: "ACTIVE"
  },
  {
    title: "PAN Card (Correction)",
    description: "Update or correct details on your existing PAN card.",
    price: 200,
    category: "Government Services",
    image: "https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?w=800&q=80",
    status: "ACTIVE"
  },
  {
    title: "Passport Application",
    description: "Complete assistance for new passport application and appointment booking.",
    price: 1500,
    category: "Government Services",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80",
    status: "ACTIVE"
  },
  {
    title: "Resume & Cover Letter Building",
    description: "Professional, ATS-friendly resume and cover letter formatting.",
    price: 200,
    category: "Career Services",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80",
    status: "ACTIVE"
  },
  {
    title: "Lamination (A4)",
    description: "High-quality document lamination to protect your important papers.",
    price: 20,
    category: "Stationery & Binding",
    image: "https://images.unsplash.com/photo-1588644485552-870632a93325?w=800&q=80",
    status: "ACTIVE"
  },
  {
    title: "Spiral Binding",
    description: "Professional spiral binding for reports and projects (up to 100 pages).",
    price: 50,
    category: "Stationery & Binding",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
    status: "ACTIVE"
  },
  {
    title: "Passport Size Photos (8 pcs)",
    description: "Instant passport size photographs printed on glossy photo paper.",
    price: 50,
    category: "Photography",
    image: "https://images.unsplash.com/photo-1534063806788-29497e887f4c?w=800&q=80",
    status: "ACTIVE"
  },
  {
    title: "Aadhaar Card Download & Print",
    description: "Download and print your Aadhaar card securely on a PVC card or glossy paper.",
    price: 100,
    category: "Government Services",
    image: "https://images.unsplash.com/photo-1633265486064-086b219458ce?w=800&q=80",
    status: "ACTIVE"
  },
  {
    title: "Website Development (Starter)",
    description: "A complete 1-page business website to get your business online.",
    price: 4999,
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
    status: "ACTIVE"
  },
  {
    title: "Income Tax Return (ITR) Filing",
    description: "Professional assistance with filing your annual Income Tax Return.",
    price: 500,
    category: "Financial Services",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
    status: "ACTIVE"
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");
    
    // Clear existing services to avoid duplicates
    await Service.deleteMany({});
    
    // Insert new services
    const result = await Service.insertMany(services);
    console.log(`Successfully inserted ${result.length} services!`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seed();
