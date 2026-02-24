import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { Decimal } from '@prisma/client/runtime/library';

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

    const quotations = await prisma.portalQuotation.findMany({
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
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                nameZh: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      { success: true, quotations },
      { status: 200 }
    );
  } catch (error) {
    console.error('Quotations fetch error:', error);
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
    const {
      customerId,
      title,
      description,
      validUntil,
      items,
      bankDetails,
      notes,
      internalNotes,
    } = body;

    if (!customerId || !title || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Customer ID, title, and at least one item are required' },
        { status: 400 }
      );
    }

    // Verify customer exists
    const customer = await prisma.portalCustomer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Generate quotation number: Q-YYYY-NNNN
    const year = new Date().getFullYear();
    const prefix = `Q-${year}-`;

    const lastQuotation = await prisma.portalQuotation.findFirst({
      where: {
        quotationNo: {
          startsWith: prefix,
        },
      },
      orderBy: {
        quotationNo: 'desc',
      },
    });

    let sequentialNumber = 1;
    if (lastQuotation) {
      const lastNumber = parseInt(lastQuotation.quotationNo.split('-').pop() || '0', 10);
      sequentialNumber = lastNumber + 1;
    }

    const quotationNo = `${prefix}${sequentialNumber.toString().padStart(4, '0')}`;

    // Calculate subtotal and total from items
    let subtotal = new Decimal(0);
    const quotationItems = items.map(
      (item: {
        productId?: string;
        name: string;
        description?: string;
        quantity: number;
        unitPrice: number;
      }) => {
        const totalPrice = new Decimal(item.unitPrice).times(item.quantity);
        subtotal = subtotal.plus(totalPrice);

        return {
          productId: item.productId || null,
          name: item.name,
          description: item.description || null,
          quantity: item.quantity,
          unitPrice: new Decimal(item.unitPrice),
          totalPrice,
        };
      }
    );

    const quotation = await prisma.portalQuotation.create({
      data: {
        quotationNo,
        customerId,
        title,
        description: description || null,
        validUntil: validUntil ? new Date(validUntil) : null,
        subtotal,
        total: subtotal,
        bankDetails: bankDetails || null,
        notes: notes || null,
        internalNotes: internalNotes || null,
        status: 'draft',
        items: {
          create: quotationItems,
        },
      },
      include: {
        items: true,
        customer: {
          select: {
            id: true,
            email: true,
            contactName: true,
            companyName: true,
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, quotation },
      { status: 201 }
    );
  } catch (error) {
    console.error('Quotation creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
