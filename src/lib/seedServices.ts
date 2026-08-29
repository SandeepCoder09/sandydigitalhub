import { Service } from '@/models/Service';

export interface ServiceSeedData {
  title: string;
  category: string;
  price: number;
  image: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export const INITIAL_SERVICES: ServiceSeedData[] = [
  // 1. Resume & Documents
  {
    title: 'Resume & Cover Letter Building',
    category: 'Career Services',
    price: 299,
    image: '/services/resume-cover-letter.webp',
    description: 'Professional resume formatting and ATS-friendly cover letter building tailored for job applications and corporate standards.',
    status: 'ACTIVE',
  },

  // 2. PAN Card & Financial
  {
    title: 'PAN Card Application / Correction',
    category: 'Government Services',
    price: 199,
    image: '/services/pan-application-correction.webp',
    description: 'Fast online application and correction assistance for physical and instant digital e-PAN cards with biometric verification.',
    status: 'ACTIVE',
  },
  {
    title: 'PAN Card New Application',
    category: 'Government Services',
    price: 199,
    image: '/services/pan-new-application.webp',
    description: 'Fresh application for new Indian PAN card with Aadhaar e-KYC integration and doorstep delivery of physical card.',
    status: 'ACTIVE',
  },
  {
    title: 'PAN Card Correction',
    category: 'Government Services',
    price: 199,
    image: '/services/pan-correction.webp',
    description: 'Name, date of birth, father name, photo, signature and address correction service in existing PAN card database.',
    status: 'ACTIVE',
  },
  {
    title: 'PF / EPFO Balance Withdrawal & KYC Update',
    category: 'Cyber Cafe Services',
    price: 250,
    image: '/services/pf-epfo-kyc.webp',
    description: 'UAN activation, Aadhaar/PAN/Bank KYC linking, and online Provident Fund (PF) advance, pension and claim withdrawal assistance.',
    status: 'ACTIVE',
  },

  // 3. Educational & Student Services
  {
    title: 'UP Scholarship Online Form Submission',
    category: 'Career Services',
    price: 150,
    image: '/services/up-scholarship.webp',
    description: 'Pre-matric and Post-matric UP Scholarship online application filling, annual renewal, biometric auth and document upload.',
    status: 'ACTIVE',
  },

  // 4. Identity & Photo Studio
  {
    title: 'Passport Size Photo Printing',
    category: 'Digital Services',
    price: 100,
    image: '/services/passport-photo-printing.webp',
    description: 'Professional background editing, retouching, and high-grade glossy photo printing for government and exam passport-size photos.',
    status: 'ACTIVE',
  },
  {
    title: 'Aadhaar Card Download & Print',
    category: 'Jan Seva Kendra / e-District',
    price: 50,
    image: '/services/aadhaar-download-print.webp',
    description: 'High-quality color printout and PVC plastic smart card printing for original masked/unmasked Aadhaar card downloads.',
    status: 'ACTIVE',
  },

  // 5. Passport & Travel
  {
    title: 'Passport Application',
    category: 'Government Services',
    price: 499,
    image: '/services/passport-application.webp',
    description: 'Online application submission, document verification, appointment booking, and PSK slot scheduling for Indian Passport.',
    status: 'ACTIVE',
  },

  // 6. Jan Seva Kendra / e-District Certificates
  {
    title: 'Aay Praman Patra (Income Certificate)',
    category: 'Jan Seva Kendra / e-District',
    price: 120,
    image: '/services/income-certificate.webp',
    description: 'Official online application and verification for Income Certificate (आय प्रमाण पत्र) via UP e-District portal.',
    status: 'ACTIVE',
  },
  {
    title: 'Jati Praman Patra (Caste Certificate)',
    category: 'Jan Seva Kendra / e-District',
    price: 120,
    image: '/services/caste-certificate.webp',
    description: 'Official online application and verification for Caste Certificate (जाति प्रमाण पत्र) for General-EWS/OBC/SC/ST categories.',
    status: 'ACTIVE',
  },
  {
    title: 'Niwas Praman Patra (Domicile / Residence Certificate)',
    category: 'Jan Seva Kendra / e-District',
    price: 120,
    image: '/services/residence-certificate.webp',
    description: 'Official online application for Domicile / Residence Certificate (निवास प्रमाण पत्र) via UP e-District with instant tracking.',
    status: 'ACTIVE',
  },
  {
    title: 'Khasra Khatauni / Bhulekh Land Records',
    category: 'Jan Seva Kendra / e-District',
    price: 50,
    image: '/services/khasra-khatauni-bhulekh.webp',
    description: 'Instant download and certified printout of UP Bhulekh Khasra-Khatauni digitized land records and certified copy.',
    status: 'ACTIVE',
  },
  {
    title: 'Ration Card Application / Member Addition',
    category: 'Jan Seva Kendra / e-District',
    price: 150,
    image: '/services/ration-card.webp',
    description: 'New NFSA Ration Card filing, adding new family members, unit update, split card, and e-Ration slip printout.',
    status: 'ACTIVE',
  },
  {
    title: 'Voter ID Card Application / Correction',
    category: 'Jan Seva Kendra / e-District',
    price: 150,
    image: '/services/voter-id.webp',
    description: 'New Voter ID card registration (Form 6), address update (Form 8), name correction, and digital voter card PDF download.',
    status: 'ACTIVE',
  },

  // 7. Printing & Copying
  {
    title: 'Document Printing (B&W)',
    category: 'Printing & Copying',
    price: 10,
    image: '/services/document-printing-bw.webp',
    description: 'High-speed laser monochrome printing on premium 75/80 GSM paper for resumes, reports, and legal documents.',
    status: 'ACTIVE',
  },
  {
    title: 'Document Printing (Color)',
    category: 'Printing & Copying',
    price: 20,
    image: '/services/document-printing-color.webp',
    description: 'Vibrant high-resolution full-color printing for presentations, brochures, certificates, and college projects.',
    status: 'ACTIVE',
  },
  {
    title: 'Photocopy (B&W)',
    category: 'Printing & Copying',
    price: 5,
    image: '/services/photocopy-bw.webp',
    description: 'Single-sided and duplex black and white photocopying with crystal sharp clarity and bulk page handling.',
    status: 'ACTIVE',
  },
  {
    title: 'Photocopy (Color)',
    category: 'Printing & Copying',
    price: 15,
    image: '/services/photocopy-color.webp',
    description: 'Full-color digital photocopying and scanning for multi-page booklets, legal files, and colored originals.',
    status: 'ACTIVE',
  },

  // 8. Transport & Vehicles
  {
    title: 'Driving License (DL) Learning & Permanent Form',
    category: 'Transport & Cyber Services',
    price: 350,
    image: '/services/driving-license.webp',
    description: 'Online application form submission, Parivahan RTO slot booking, LL mock test prep, and fee payment for Driving License.',
    status: 'ACTIVE',
  },

  // 9. Software & Web Engineering
  {
    title: 'Website Development',
    category: 'Web Development',
    price: 4999,
    image: '/services/website-development.webp',
    description: 'Custom responsive web application and e-commerce development with fast loading speed, modern UI design, SEO, and CMS.',
    status: 'ACTIVE',
  },
];

let isSeeded = false;

export async function ensureServicesSeeded() {
  if (isSeeded) return;

  try {
    const count = await Service.countDocuments();
    if (count === 0) {
      await Service.insertMany(INITIAL_SERVICES);
      console.log(`Seeded ${INITIAL_SERVICES.length} initial services successfully.`);
    } else {
      // Sync/update service images to the new custom local images
      for (const s of INITIAL_SERVICES) {
        await Service.updateOne(
          { title: s.title },
          { 
            $set: { 
              image: s.image,
              category: s.category,
              description: s.description,
            } 
          },
          { upsert: true }
        );
      }
      console.log(`Synchronized all ${INITIAL_SERVICES.length} service images and categories.`);
    }
    isSeeded = true;
  } catch (error) {
    console.error('Error seeding/syncing services:', error);
  }
}
