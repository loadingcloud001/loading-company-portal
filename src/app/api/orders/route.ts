import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const where = user.role === 'admin' ? {} : { customerId: user.id };

    const orders = await prisma.portalOrder.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            contactName: true,
            companyName: true,
          },
        },
        quotation: {
          select: {
            id: true,
            quotationNo: true,
            title: true,
          },
        },
        payments: true,
        deliveries: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      { success: true, orders },
      { status: 200 }
    );
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { quotationId, depositRequired, deliveryAddress, expectedDelivery, notes } = body;

    if (!quotationId) {
      return NextResponse.json(
        { error: 'Quotation ID is required' },
        { status: 400 }
      );
    }

    // Fetch the quotation and verify it's accepted
    const quotation = await prisma.portalQuotation.findUnique({
      where: { id: quotationId },
      include: {
        order: true,
      },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 }
      );
    }

    if (quotation.status !== 'accepted') {
      return NextResponse.json(
        { error: 'Quotation must be accepted before converting to an order' },
        { status: 400 }
      );
    }

    if (quotation.order) {
      return NextResponse.json(
        { error: 'An order already exists for this quotation' },
        { status: 409 }
      );
    }

    // Auto-generate order number: ORD-YYYY-NNNN
    const year = new Date().getFullYear();
    const prefix = `ORD-${year}-`;

    const lastOrder = await prisma.portalOrder.findFirst({
      where: {
        orderNo: {
          startsWith: prefix,
        },
      },
      orderBy: {
        orderNo: 'desc',
      },
    });

    let sequentialNumber = 1;
    if (lastOrder) {
      const lastNumber = parseInt(lastOrder.orderNo.split('-').pop() || '0', 10);
      sequentialNumber = lastNumber + 1;
    }

    const orderNo = `${prefix}${sequentialNumber.toString().padStart(4, '0')}`;

    const order = await prisma.portalOrder.create({
      data: {
        orderNo,
        quotationId,
        customerId: quotation.customerId,
        subtotal: quotation.subtotal,
        discount: quotation.discount,
        total: quotation.total,
        depositRequired: depositRequired ? Number(depositRequired) : 0,
        deliveryAddress: deliveryAddress || null,
        expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : null,
        notes: notes || null,
        status: 'pending',
      },
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            contactName: true,
            companyName: true,
          },
        },
        quotation: {
          select: {
            id: true,
            quotationNo: true,
            title: true,
          },
        },
        payments: true,
        deliveries: true,
      },
    });

    return NextResponse.json(
      { success: true, order },
      { status: 201 }
    );
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
