import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { HelpArticle } from '@/models/HelpArticle';

const DEFAULT_ARTICLES = [
  {
    slug: 'track-service-request-status',
    title: 'How do I track my service request online?',
    category: 'Service Requests',
    division: 'SARA_HUB',
    summary: 'Learn how to use your Request ID (SDH-YYYYMMDD-XXXX) to monitor document verification and processing stages.',
    content: `You can track the real-time progress of any digital service request using our [Track Order page](/track-order) or your customer requests dashboard.\n\n### Steps to Track:\n1. Open [/track-order](/track-order).\n2. Enter your unique Request ID (found on your payment receipt or notification SMS).\n3. View your 4-step status pipeline: **Pending Verification → Processing → Awaiting Signature / Appointment → Completed**.\n4. Download completed certificates or invoices directly once marked as Completed.`,
    tags: ['track', 'order', 'status', 'request'],
    featured: true,
    order: 1,
  },
  {
    slug: 'pan-card-documents-required',
    title: 'What documents are required for a new PAN Card application?',
    category: 'Service Requests',
    division: 'SARA_HUB',
    summary: 'Complete checklist of Proof of Identity (POI), Proof of Address (POA), and Date of Birth documents.',
    content: `For Indian citizens applying for a new PAN card (Form 49A), the following documents are accepted:\n\n* **Proof of Identity (POI)**: Aadhaar Card, Voter ID, Passport, or Driving License.\n* **Proof of Address (POA)**: Aadhaar Card, Bank Account Statement (within 3 months), Electricity Bill.\n* **Proof of Date of Birth (DOB)**: Aadhaar Card, 10th Marksheet, Birth Certificate.\n\n*Note*: Aadhaar card serves as valid proof for all three requirements simultaneously.`,
    tags: ['pan', 'documents', 'checklist', 'aadhaar'],
    featured: true,
    order: 2,
  },
  {
    slug: 'save-studio-project-quotation',
    title: 'How does the Sandy Digital Studio Project Calculator work?',
    category: 'Sandy Digital Studio',
    division: 'SANDY_STUDIO',
    summary: 'How to calculate custom website and app development estimates and save official quote references.',
    content: `Our [Project Cost Calculator](/calculator) allows you to select your target project type (Business Website, Fullstack Web App, Mobile App, or UI/UX Design), choose necessary add-on modules, and generate an itemized estimate.\n\n### Saving Your Quote:\n* Click **Save & Generate Official Quote ID**.\n* A unique reference ID (e.g. \`SDS-2026-00124\`) will be issued.\n* Your quote is valid for 30 days and locks in your estimated base rates.`,
    tags: ['calculator', 'quote', 'studio', 'pricing'],
    featured: true,
    order: 3,
  },
  {
    slug: 'partner-center-onboarding',
    title: 'How can I become an authorized SARA Partner Center?',
    category: 'Partner Network',
    division: 'SARA_HUB',
    summary: 'Requirements and application steps to start your own branded digital service center.',
    content: `Local CSC centers, cyber cafes, and digital kiosks can apply to join the **SARA Partner Network** at [/partners/apply](/partners/apply).\n\n### Benefits:\n* Custom public portal URL (\`/center/your-shop\`).\n* Individual staff operator accounts.\n* 80% to 85% revenue share on every processed request.\n* Zero software fees or complex setups.`,
    tags: ['partner', 'franchise', 'apply', 'center'],
    featured: true,
    order: 4,
  },
  {
    slug: 'refund-and-cancellation-policy',
    title: 'What is the refund policy for cancelled requests?',
    category: 'Payments & Refunds',
    division: 'ALL',
    summary: 'Terms under which service fees are refunded if a request cannot be processed.',
    content: `If an application cannot be submitted due to government portal eligibility issues or documentation rejection prior to processing, our team initiates a prompt refund to the original payment source according to our [Refund Policy](/refund).\n\nGovernment statutory fees already remitted to official treasury departments are non-refundable.`,
    tags: ['refund', 'cancellation', 'payment'],
    featured: false,
    order: 5,
  },
];

// GET /api/help — Returns knowledge base articles with optional search & category filter
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.toLowerCase();
    const category = searchParams.get('category');

    await connectDB();

    let articles = await HelpArticle.find({ status: 'PUBLISHED' }).sort({ order: 1 }).lean();

    // If database is empty, seed defaults
    if (articles.length === 0) {
      await HelpArticle.insertMany(DEFAULT_ARTICLES);
      articles = await HelpArticle.find({ status: 'PUBLISHED' }).sort({ order: 1 }).lean();
    }

    let filtered = articles;

    if (category && category !== 'ALL') {
      filtered = filtered.filter((a) => a.category.toLowerCase() === category.toLowerCase());
    }

    if (q) {
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.tags.some((t: string) => t.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      success: true,
      articles: filtered,
      categories: [
        'ALL',
        'Service Requests',
        'Sandy Digital Studio',
        'Partner Network',
        'Payments & Refunds',
        'Free Tools',
      ],
    });
  } catch (error: any) {
    console.error('[GET /api/help]', error);
    // Fallback to static defaults
    return NextResponse.json({
      success: true,
      articles: DEFAULT_ARTICLES,
      categories: [
        'ALL',
        'Service Requests',
        'Sandy Digital Studio',
        'Partner Network',
        'Payments & Refunds',
        'Free Tools',
      ],
    });
  }
}
