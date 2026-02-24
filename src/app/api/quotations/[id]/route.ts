import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const quotation = await prisma.portalQuotation.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            contactName: true,
            companyName: true,
            phone: true,
            address: true,
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
    });

    if (!quotation) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 }
      );
    }

    // Customers can only view their own quotations
    if (user.role !== 'admin' && quotation.customerId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: true, quotation },
      { status: 200 }
    );
  } catch (error) {
    console.error('Quotation fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const quotation = await prisma.portalQuotation.findUnique({
      where: { id },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 }
      );
    }

    const body = await request.json();

    if (user.role === 'admin') {
      // Admin can update status, notes, internalNotes
      const { status, notes, internalNotes } = body;

      const validStatuses = ['draft', 'sent', 'accepted', 'rejected'];
      if (status && !validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }

      const updateData: Record<string, unknown> = {};
      if (status !== undefined) updateData.status = status;
      if (notes !== undefined) updateData.notes = notes;
      if (internalNotes !== undefined) updateData.internalNotes = internalNotes;

      const updated = await prisma.portalQuotation.update({
        where: { id },
        data: updateData,
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
        { success: true, quotation: updated },
        { status: 200 }
      );
    } else {
      // Customer can only accept or reject if the quotation is "sent"
      if (quotation.customerId !== user.id) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }

      if (quotation.status !== 'sent') {
        return NextResponse.json(
          { error: 'Quotation can only be accepted or rejected when its status is "sent"' },
          { status: 400 }
        );
      }

      const { status } = body;
      const allowedStatuses = ['accepted', 'rejected'];

      if (!status || !allowedStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Customers can only set: ${allowedStatuses.join(', ')}` },
          { status: 400 }
        );
      }

      const updated = await prisma.portalQuotation.update({
        where: { id },
        data: { status },
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
        { success: true, quotation: updated },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Quotation update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
