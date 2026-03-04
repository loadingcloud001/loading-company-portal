import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...\n");

  // --------------------------------------------------
  // 1. Admin User
  // --------------------------------------------------
  console.log("Creating admin user...");
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.portalCustomer.upsert({
    where: { email: "admin@loadingtechnology.com" },
    update: {},
    create: {
      email: "admin@loadingtechnology.com",
      password: hashedPassword,
      contactName: "Admin",
      role: "admin",
      status: "active",
    },
  });
  console.log(`  Admin user created: ${admin.email}\n`);

  // --------------------------------------------------
  // 2. Product Categories (DevB 4S aligned)
  // --------------------------------------------------
  console.log("Upserting product categories...");

  const categoriesData = [
    {
      slug: "ai-monitoring",
      name: "AI Safety Monitoring",
      nameZh: "AI安全監察系統",
      icon: "Camera",
      sortOrder: 1,
      description:
        "AI-powered CCTV for PPE detection, hazard alerts and behavior monitoring",
      descriptionZh:
        "AI驅動的閉路電視，用於個人防護裝備偵測、危險警報及行為監控",
    },
    {
      slug: "smart-wearables",
      name: "Smart Wearable Devices",
      nameZh: "智能穿戴裝置",
      icon: "ShieldCheck",
      sortOrder: 2,
      description:
        "Smart helmets and wristbands with sensors for worker safety",
      descriptionZh: "配備感應器的智能安全帽和手環，保障工人安全",
    },
    {
      slug: "proximity-alert",
      name: "Proximity Alert System",
      nameZh: "接近警報系統",
      icon: "Radio",
      sortOrder: 3,
      description:
        "UWB/RFID anti-collision detection between workers and machinery",
      descriptionZh:
        "UWB/RFID防碰撞偵測系統，防止工人與機械碰撞",
    },
    {
      slug: "environmental-monitoring",
      name: "Environmental Monitoring",
      nameZh: "環境監測系統",
      icon: "Thermometer",
      sortOrder: 4,
      description:
        "IoT sensors for air quality, noise, weather and gas detection",
      descriptionZh:
        "用於空氣質素、噪音、天氣及氣體偵測的IoT感應器",
    },
    {
      slug: "digital-platform",
      name: "Digital Management Platform",
      nameZh: "數碼管理平台",
      icon: "Monitor",
      sortOrder: 5,
      description:
        "Centralised management platform, ePTW, dashboards and data analytics",
      descriptionZh:
        "集中管理平台、電子工作許可證、儀表板及數據分析",
    },
    {
      slug: "access-tracking",
      name: "Access & Equipment Tracking",
      nameZh: "出入管理及設備追蹤",
      icon: "Fingerprint",
      sortOrder: 6,
      description:
        "Site access control and digitized equipment tracking systems",
      descriptionZh: "工地出入管理及數碼化設備追蹤系統",
    },
  ];

  const categories: Record<string, { id: string }> = {};

  for (const cat of categoriesData) {
    const category = await prisma.portalProductCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        nameZh: cat.nameZh,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
        description: cat.description,
        descriptionZh: cat.descriptionZh,
      },
      create: cat,
    });
    categories[cat.slug] = category;
    console.log(`  Category upserted: ${cat.name}`);
  }
  console.log("");

  // --------------------------------------------------
  // 3. Clean up old categories no longer in use
  // --------------------------------------------------
  console.log("Cleaning up old categories...");
  const validSlugs = categoriesData.map((c) => c.slug);
  const deleted = await prisma.portalProductCategory.deleteMany({
    where: { slug: { notIn: validSlugs } },
  });
  console.log(`  Removed ${deleted.count} old categories.\n`);

  // --------------------------------------------------
  // 4. Products – delete existing then create fresh
  // --------------------------------------------------
  console.log("Deleting existing products...");
  await prisma.portalProduct.deleteMany();
  console.log("  Existing products deleted.\n");

  console.log("Creating products...");

  const productsData = [
    {
      categoryId: categories["digital-platform"].id,
      slug: "cmp-platform",
      name: "CMP — Construction Management Platform",
      nameZh: "CMP — 建造管理平台",
      shortDesc:
        "Centralised management platform for real-time site safety monitoring, data analytics, alerts, and reporting — the software backbone of 4S compliance.",
      shortDescZh:
        "集中管理平台，提供實時工地安全監控、數據分析、警報及報告 — 4S合規的軟件核心。",
      description:
        "CMP (Construction Management Platform) is a centralised hub that integrates data from IoT devices across your construction site. It provides real-time dashboards, automated alerts, digital permit-to-work (ePTW), equipment tracking, and comprehensive reporting — all designed to help you meet DevB Smart Site Safety System (4S) requirements.\n\nKey features include:\n• Real-time safety dashboard with live data from all connected devices\n• Automated alert system for safety incidents and threshold breaches\n• Digital Permit-to-Work (ePTW) management\n• Equipment and personnel tracking integration\n• Comprehensive analytics and reporting for 4S compliance\n• Multi-site management from a single platform\n• Mobile-responsive interface for on-site access",
      descriptionZh:
        "CMP（建造管理平台）是集中管理樞紐，整合工地各IoT裝置的數據。提供實時儀表板、自動警報、電子工作許可證（ePTW）、設備追蹤及全面報告 — 助您符合發展局智慧工地安全系統（4S）要求。\n\n主要功能包括：\n• 實時安全儀表板，顯示所有連接裝置的即時數據\n• 自動警報系統，針對安全事件及閾值超標\n• 電子工作許可證（ePTW）管理\n• 設備及人員追蹤整合\n• 全面分析及報告，符合4S合規要求\n• 單一平台多工地管理\n• 流動裝置適配介面，方便工地現場使用",
      basePrice: 0,
      pricingModel: "monthly",
      isFeatured: true,
      leadTimeDays: 14,
      specifications: {
        Platform: "Web-based (responsive)",
        Deployment: "Cloud (DigitalOcean)",
        "Data Integration": "REST API, MQTT, WebSocket",
        "Multi-site": "Supported",
        "User Roles": "Admin, Manager, Supervisor, Viewer",
        "Reporting": "PDF export, scheduled reports",
        "Alerts": "Email, SMS, in-app push",
      },
    },
  ];

  await prisma.$transaction(
    productsData.map((product) =>
      prisma.portalProduct.create({ data: product })
    )
  );
  console.log(`  ${productsData.length} product(s) created.\n`);

  // --------------------------------------------------
  // Done
  // --------------------------------------------------
  console.log("Seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
