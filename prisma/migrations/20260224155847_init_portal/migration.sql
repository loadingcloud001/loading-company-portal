-- CreateTable
CREATE TABLE "portal_customers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "companyName" TEXT,
    "contactName" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "role" TEXT NOT NULL DEFAULT 'customer',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portal_customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_product_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameZh" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "descriptionZh" TEXT,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portal_product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_products" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameZh" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDesc" TEXT,
    "shortDescZh" TEXT,
    "description" TEXT,
    "descriptionZh" TEXT,
    "specifications" JSONB,
    "images" TEXT[],
    "basePrice" DECIMAL(65,30),
    "pricingModel" TEXT NOT NULL DEFAULT 'unit',
    "hardwareList" JSONB,
    "leadTimeDays" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portal_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_demos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameZh" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "descriptionZh" TEXT,
    "demoType" TEXT NOT NULL DEFAULT 'link',
    "url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "categoryId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portal_demos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_quotations" (
    "id" TEXT NOT NULL,
    "quotationNo" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "validUntil" TIMESTAMP(3),
    "subtotal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "discount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "bankDetails" JSONB,
    "notes" TEXT,
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portal_quotations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_quotation_items" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "productId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(65,30) NOT NULL,
    "totalPrice" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "portal_quotation_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_orders" (
    "id" TEXT NOT NULL,
    "orderNo" TEXT NOT NULL,
    "quotationId" TEXT,
    "customerId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "subtotal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "discount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "depositRequired" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "depositPaid" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "deliveryAddress" TEXT,
    "expectedDelivery" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portal_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_payments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'bank_transfer',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "confirmedAt" TIMESTAMP(3),
    "confirmedBy" TEXT,
    "bankRef" TEXT,
    "receiptUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portal_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_deliveries" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "trackingNo" TEXT,
    "carrier" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "items" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portal_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_inquiries" (
    "id" TEXT NOT NULL,
    "customerId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "productSlug" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portal_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "portal_customers_email_key" ON "portal_customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "portal_product_categories_slug_key" ON "portal_product_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "portal_products_slug_key" ON "portal_products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "portal_demos_slug_key" ON "portal_demos"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "portal_quotations_quotationNo_key" ON "portal_quotations"("quotationNo");

-- CreateIndex
CREATE UNIQUE INDEX "portal_orders_orderNo_key" ON "portal_orders"("orderNo");

-- CreateIndex
CREATE UNIQUE INDEX "portal_orders_quotationId_key" ON "portal_orders"("quotationId");

-- AddForeignKey
ALTER TABLE "portal_products" ADD CONSTRAINT "portal_products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "portal_product_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_demos" ADD CONSTRAINT "portal_demos_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "portal_product_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_quotations" ADD CONSTRAINT "portal_quotations_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "portal_customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_quotation_items" ADD CONSTRAINT "portal_quotation_items_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "portal_quotations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_quotation_items" ADD CONSTRAINT "portal_quotation_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "portal_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_orders" ADD CONSTRAINT "portal_orders_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "portal_quotations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_orders" ADD CONSTRAINT "portal_orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "portal_customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_payments" ADD CONSTRAINT "portal_payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "portal_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_deliveries" ADD CONSTRAINT "portal_deliveries_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "portal_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_inquiries" ADD CONSTRAINT "portal_inquiries_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "portal_customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
