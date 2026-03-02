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

/** GET /api/admin/products — list ALL products (including inactive) */
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const denied = adminGuard(user);
    if (denied) return denied;

    const products = await prisma.portalProduct.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Admin products GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/** POST /api/admin/products — create a new product */
export async function POST(request: NextRequest) {
  try {
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

    if (!categoryId || !name || !nameZh || !slug) {
      return NextResponse.json(
        { error: 'categoryId, name, nameZh, and slug are required' },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await prisma.portalProduct.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 409 });
    }

    const product = await prisma.portalProduct.create({
      data: {
        categoryId,
        name,
        nameZh,
        slug,
        shortDesc: shortDesc || null,
        shortDescZh: shortDescZh || null,
        description: description || null,
        descriptionZh: descriptionZh || null,
        basePrice: basePrice ? parseFloat(basePrice) : null,
        pricingModel: pricingModel || 'unit',
        leadTimeDays: leadTimeDays ? parseInt(leadTimeDays, 10) : null,
        demoUrl: demoUrl || null,
        demoType: demoType || 'iframe',
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error('Admin products POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
