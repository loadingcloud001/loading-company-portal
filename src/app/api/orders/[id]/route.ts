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

    const order = await prisma.portalOrder.findUnique({
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
        quotation: {
          include: {
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
        },
        payments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        deliveries: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Customers can only view their own orders
    if (user.role !== 'admin' && order.customerId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: true, order },
      { status: 200 }
    );
  } catch (error) {
    console.error('Order fetch error:', error);
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

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const order = await prisma.portalOrder.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      status,
      deliveryAddress,
      expectedDelivery,
      deliveredAt,
      notes,
      depositRequired,
      depositPaid,
    } = body;

    const updateData: Record<string, unknown> = {};

    if (status !== undefined) updateData.status = status;
    if (deliveryAddress !== undefined) updateData.deliveryAddress = deliveryAddress;
    if (expectedDelivery !== undefined) {
      updateData.expectedDelivery = expectedDelivery ? new Date(expectedDelivery) : null;
    }
    if (deliveredAt !== undefined) {
      updateData.deliveredAt = deliveredAt ? new Date(deliveredAt) : null;
    }
    if (notes !== undefined) updateData.notes = notes;
    if (depositRequired !== undefined) updateData.depositRequired = Number(depositRequired);
    if (depositPaid !== undefined) updateData.depositPaid = Number(depositPaid);

    const updated = await prisma.portalOrder.update({
      where: { id },
      data: updateData,
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
      { success: true, order: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
