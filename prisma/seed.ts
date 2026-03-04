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
      slug: "centralised-platform",
      name: "Centralised Management Platform",
      nameZh: "集中管理平台",
      icon: "Monitor",
      sortOrder: 1,
      description:
        "Central platform integrating all smart site safety devices, dashboards and data analytics",
      descriptionZh:
        "整合所有智慧工地安全裝置的中央平台，提供儀表板及數據分析",
    },
    {
      slug: "equipment-tracking",
      name: "Plant & Equipment Tracking",
      nameZh: "機械設備追蹤系統",
      icon: "Wrench",
      sortOrder: 2,
      description:
        "Digitized tracking system for site plants, powered tools and ladders",
      descriptionZh:
        "工地機械、電動工具及梯子的數碼化追蹤系統",
    },
    {
      slug: "permit-to-work",
      name: "Digital Permit-to-Work (ePTW)",
      nameZh: "電子工作許可證系統",
      icon: "ClipboardCheck",
      sortOrder: 3,
      description:
        "Digitalized permit-to-work system for high risk activities",
      descriptionZh:
        "高風險作業的數碼化工作許可證系統",
    },
    {
      slug: "hazard-access-control",
      name: "Hazardous Area Access Control",
      nameZh: "危險區域電子門禁",
      icon: "Lock",
      sortOrder: 4,
      description:
        "Electronic lock and key system for hazardous areas access control",
      descriptionZh:
        "以電子鎖和鑰匙系統管理危險區域出入",
    },
    {
      slug: "plant-danger-alert",
      name: "Mobile Plant Danger Zone Alert",
      nameZh: "流動機械危險區域警報",
      icon: "AlertTriangle",
      sortOrder: 5,
      description:
        "Unsafe acts and dangerous situation alert for mobile plant operation danger zones",
      descriptionZh:
        "偵測流動機械操作危險區內的不安全行為及危險情況並發出警報",
    },
    {
      slug: "crane-zone-alert",
      name: "Crane Lifting Zone Alert",
      nameZh: "塔式起重機吊運區域警報",
      icon: "Construction",
      sortOrder: 6,
      description:
        "Unsafe acts and dangerous situation alert for tower crane lifting zones",
      descriptionZh:
        "偵測塔式起重機吊運區內的不安全行為及危險情況並發出警報",
    },
    {
      slug: "worker-monitoring",
      name: "Smart Worker Monitoring",
      nameZh: "智能工人監測裝置",
      icon: "HardHat",
      sortOrder: 7,
      description:
        "Smart monitoring devices for workers and frontline site personnel",
      descriptionZh:
        "工人及前線工地人員的智能監測裝置",
    },
    {
      slug: "ai-safety-monitoring",
      name: "AI Safety Monitoring",
      nameZh: "AI安全監察系統",
      icon: "Camera",
      sortOrder: 8,
      description:
        "Safety monitoring system using artificial intelligence for real-time hazard detection",
      descriptionZh:
        "運用人工智能的安全監控系統，實時偵測危險情況",
    },
    {
      slug: "confined-space",
      name: "Confined Space Monitoring",
      nameZh: "密閉空間監測系統",
      icon: "Wind",
      sortOrder: 9,
      description:
        "Monitoring system for confined space safety including gas detection and air quality",
      descriptionZh:
        "密閉空間安全監測系統，包括氣體偵測及空氣質素監控",
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
  // 3. Products – delete existing then create fresh
  // --------------------------------------------------
  console.log("Deleting existing products...");
  await prisma.portalProduct.deleteMany();
  console.log("  Existing products deleted.\n");

  // --------------------------------------------------
  // 4. Clean up old categories no longer in use
  // --------------------------------------------------
  console.log("Cleaning up old categories...");
  const validSlugs = categoriesData.map((c) => c.slug);
  const deleted = await prisma.portalProductCategory.deleteMany({
    where: { slug: { notIn: validSlugs } },
  });
  console.log(`  Removed ${deleted.count} old categories.\n`);

  // --------------------------------------------------
  // 5. Create products
  // --------------------------------------------------
  console.log("Creating products...");

  const productsData = [
    {
      categoryId: categories["centralised-platform"].id,
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
