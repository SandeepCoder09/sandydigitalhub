import { Service } from '@/models/Service';

interface ServiceSeedData {
  title: string;
  category: string;
  price: number;
  image: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export const INITIAL_SERVICES: ServiceSeedData[] = [
  {
    title: 'Aay Praman Patra (Income Certificate)',
    category: 'Jan Seva Kendra / e-District',
    price: 120,
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
    description: 'Official online application and verification for Income Certificate (आय प्रमाण पत्र) via UP e-District portal.',
    status: 'ACTIVE',
  },
  {
    title: 'Jati Praman Patra (Caste Certificate)',
    category: 'Jan Seva Kendra / e-District',
    price: 120,
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800',
    description: 'Official online application and verification for Caste Certificate (जाति प्रमाण पत्र) for OBC/SC/ST categories.',
    status: 'ACTIVE',
  },
  {
    title: 'Niwas Praman Patra (Domicile / Residence Certificate)',
    category: 'Jan Seva Kendra / e-District',
    price: 120,
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=800',
    description: 'Official online application for Domicile / Residence Certificate (निवास प्रमाण पत्र) via UP e-District.',
    status: 'ACTIVE',
  },
  {
    title: 'Voter ID Card Application / Correction',
    category: 'Jan Seva Kendra / e-District',
    price: 150,
    image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=800',
    description: 'New Voter ID card registration, address update, name correction, and digital voter card PDF download.',
    status: 'ACTIVE',
  },
  {
    title: 'Ration Card Application / Member Addition',
    category: 'Jan Seva Kendra / e-District',
    price: 150,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    description: 'New Ration Card filing, adding new family members, unit update, and e-Ration slip printout.',
    status: 'ACTIVE',
  },
  {
    title: 'Khasra Khatauni / Bhulekh Land Records',
    category: 'Jan Seva Kendra / e-District',
    price: 50,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
    description: 'Instant download and certified printout of UP Bhulekh Khasra-Khatauni land record details.',
    status: 'ACTIVE',
  },
  {
    title: 'Driving License (DL) Learning & Permanent Form',
    category: 'Transport & Cyber Services',
    price: 350,
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800',
    description: 'Online application form submission, RTO slot booking, and fee payment for Learning & Permanent Driving License.',
    status: 'ACTIVE',
  },
  {
    title: 'UP Scholarship Online Form Submission',
    category: 'Cyber Cafe Services',
    price: 150,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    description: 'Pre-matric and Post-matric UP Scholarship online application filling, renewal, and document upload.',
    status: 'ACTIVE',
  },
  {
    title: 'PF / EPFO Balance Withdrawal & KYC Update',
    category: 'Cyber Cafe Services',
    price: 250,
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800',
    description: 'UAN activation, Aadhaar/PAN/Bank KYC linking, and online Provident Fund (PF) advance/claim withdrawal.',
    status: 'ACTIVE',
  },
  {
    title: 'PAN Card Application / Correction',
    category: 'Cyber Cafe Services',
    price: 199,
    image: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&q=80&w=800',
    description: 'Fast online application or correction service for physical and instant digital e-PAN cards.',
    status: 'ACTIVE',
  },
  {
    title: 'Aadhaar Card Download & Print',
    category: 'Cyber Cafe Services',
    price: 50,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800',
    description: 'High-quality color printout and PVC plastic card printing for original Aadhaar card downloads.',
    status: 'ACTIVE',
  },
  {
    title: 'Passport Size Photo Printing',
    category: 'Digital Services',
    price: 100,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
    description: 'Professional background editing, retouching, and high-grade glossy photo printing for passport-size photographs.',
    status: 'ACTIVE',
  },
  {
    title: 'Website Development',
    category: 'Web Development',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    description: 'Custom responsive website development with fast loading speed, modern UI design, SEO optimization, and mobile-friendly layouts.',
    status: 'ACTIVE',
  },
  {
    title: 'Resume & Cover Letter Building',
    category: 'Graphic Design & Documents',
    price: 299,
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800',
    description: 'Professional resume formatting and ATS-friendly cover letter building tailored for job applications and corporate standards.',
    status: 'ACTIVE',
  },
];

let isSeeded = false;

export async function ensureServicesSeeded() {
  // Fast path: if already seeded during server runtime, skip DB check
  if (isSeeded) return;

  try {
    const count = await Service.countDocuments();
    if (count === 0) {
      await Service.insertMany(INITIAL_SERVICES);
      console.log(`Seeded ${INITIAL_SERVICES.length} initial services successfully.`);
    }
    isSeeded = true;
  } catch (error) {
    console.error('Error seeding services:', error);
  }
}
