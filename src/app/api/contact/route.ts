import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ContactEnquiry } from '@/models/ContactEnquiry';
import { Order } from '@/models/Order';
import { handleApiError, AppError } from '@/lib/errors';
import { contactEnquirySchema } from '@/lib/validation/schemas';

function generateEnquiryNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `ENQ-${year}-${randomSuffix}`;
}

// POST /api/contact — Route and record structured customer enquiries
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = contactEnquirySchema.parse(body);

    await connectDB();

    // If relatedRequestNumber is supplied, check validity
    if (validated.relatedRequestNumber) {
      const orderExists = await Order.findOne({
        $or: [
          { customOrderId: validated.relatedRequestNumber.trim() },
          { orderId: validated.relatedRequestNumber.trim() },
        ],
      }).lean();

      if (!orderExists && validated.department === 'EXISTING_REQUEST') {
        throw AppError.notFound(
          'The provided Request ID could not be found. Please check your tracking number or select General Support.'
        );
      }
    }

    let enquiryNumber = generateEnquiryNumber();
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      const existing = await ContactEnquiry.findOne({ enquiryNumber });
      if (!existing) isUnique = true;
      else enquiryNumber = generateEnquiryNumber();
      attempts++;
    }

    const enquiry = await ContactEnquiry.create({
      enquiryNumber,
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      department: validated.department,
      relatedRequestNumber: validated.relatedRequestNumber,
      subject: validated.subject,
      message: validated.message,
      status: 'NEW',
    });

    return NextResponse.json({
      success: true,
      enquiryNumber: enquiry.enquiryNumber,
      message: 'Your inquiry has been successfully routed to the responsible department.',
    });
  } catch (error: any) {
    return handleApiError(error, 'POST /api/contact');
  }
}
