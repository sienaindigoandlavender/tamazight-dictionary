import { NextRequest, NextResponse } from 'next/server';

interface ContactFormData {
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json();

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Log the submission (in production, send to email service or database)
    console.log('Contact form submission:', {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone || 'Not provided',
      message: data.message || 'No message',
      timestamp: new Date().toISOString(),
    });

    // If a webhook URL is configured, send to it
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'amawal',
          ...data,
          timestamp: new Date().toISOString(),
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
