import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

function adminGuard(user: { role: string } | null) {
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }
  return null;
}

/** GET /api/admin/products/[id] — single product for editing */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUser(request);
    const denied = adminGuard(user);
    if (denied) return denied;

    const product = await prisma.portalProduct.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Admin product GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/** PUT /api/admin/products/[id] — update product */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUser(request);
    const denied = adminGuard(user);
    if (denied) return denied;

    const body = await request.json();

    const {
      categoryId,
      name,
      nameZh,
      slug,
      shortDesc,
      shortDescZh,
      description,
      descriptionZh,
      basePrice,
      pricingModel,
      leadTimeDays,
      demoUrl,
      demoType,
      isActive,
      isFeatured,
    } = body;

    // Check slug uniqueness (exclude current product)
    if (slug) {
      const existing = await prisma.portalProduct.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) {
        return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 409 });
      }
    }

    const product = await prisma.portalProduct.update({
      where: { id },
      data: {
        ...(categoryId !== undefined && { categoryId }),
        ...(name !== undefined && { name }),
        ...(nameZh !== undefined && { nameZh }),
        ...(slug !== undefined && { slug }),
        ...(shortDesc !== undefined && { shortDesc: shortDesc || null }),
        ...(shortDescZh !== undefined && { shortDescZh: shortDescZh || null }),
        ...(description !== undefined && { description: description || null }),
        ...(descriptionZh !== undefined && { descriptionZh: descriptionZh || null }),
        ...(basePrice !== undefined && { basePrice: basePrice ? parseFloat(basePrice) : null }),
        ...(pricingModel !== undefined && { pricingModel }),
        ...(leadTimeDays !== undefined && { leadTimeDays: leadTimeDays ? parseInt(leadTimeDays, 10) : null }),
        ...(demoUrl !== undefined && { demoUrl: demoUrl || null }),
        ...(demoType !== undefined && { demoType: demoType || 'iframe' }),
        ...(isActive !== undefined && { isActive }),
        ...(isFeatured !== undefined && { isFeatured }),
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Admin product PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/** DELETE /api/admin/products/[id] — delete product */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUser(request);
    const denied = adminGuard(user);
    if (denied) return denied;

    // Check if product exists
    const product = await prisma.portalProduct.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check for linked quotation items
    const linkedItems = await prisma.portalQuotationItem.count({
      where: { productId: id },
    });
    if (linkedItems > 0) {
      return NextResponse.json(
        { error: `Cannot delete: product is referenced in ${linkedItems} quotation item(s). Deactivate it instead.` },
        { status: 409 }
      );
    }

    await prisma.portalProduct.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin product DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
