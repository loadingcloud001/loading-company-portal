import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, contactName, companyName, phone } = body;

    if (!email || !password || !contactName) {
      return NextResponse.json(
        { error: 'Email, password, and contact name are required' },
        { status: 400 }
      );
    }

    const existingCustomer = await prisma.portalCustomer.findUnique({
      where: { email },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    await prisma.portalCustomer.create({
      data: {
        email,
        password: hashedPassword,
        contactName,
        companyName: companyName || null,
        phone: phone || null,
        role: 'customer',
        status: 'active',
      },
    });

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
