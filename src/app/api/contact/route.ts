import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ContactEnquiry } from '@/models/ContactEnquiry';
import { Order } from '@/models/Order';

function generateEnquiryNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `ENQ-${year}-${randomSuffix}`;
}

// POST /api/contact — Route and record structured customer enquiries
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, department, relatedRequestNumber, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are mandatory fields.' },
        { status: 400 }
      );
    }

    await connectDB();

    // If relatedRequestNumber is supplied, check validity
    if (relatedRequestNumber) {
      const orderExists = await Order.findOne({
        $or: [
          { customOrderId: relatedRequestNumber.trim() },
          { orderId: relatedRequestNumber.trim() },
        ],
      }).lean();

      if (!orderExists && department === 'EXISTING_REQUEST') {
        return NextResponse.json(
          {
            error:
              'The provided Request ID could not be found. Please check your tracking number or select General Support.',
          },
          { status: 404 }
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
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : undefined,
      department: department || 'GENERAL',
      relatedRequestNumber: relatedRequestNumber ? relatedRequestNumber.trim() : undefined,
      subject: subject.trim(),
      message: message.trim(),
      status: 'NEW',
    });

    return NextResponse.json({
      success: true,
      enquiryNumber: enquiry.enquiryNumber,
      message: 'Your inquiry has been successfully routed to the responsible department.',
    });
  } catch (error: any) {
    console.error('[POST /api/contact]', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
