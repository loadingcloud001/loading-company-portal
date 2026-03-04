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
  // 2. Product Categories
  // --------------------------------------------------
  console.log("Upserting product categories...");

  const categoriesData = [
    {
      slug: "smart-helmet",
      name: "Smart Helmet System",
      nameZh: "智能安全帽系統",
      icon: "ShieldCheck",
      sortOrder: 1,
      description:
        "Worker health monitoring, fall detection, and GPS tracking systems",
      descriptionZh: "工人健康監測、跌倒偵測及GPS追蹤系統",
    },
    {
      slug: "proximity-alert",
      name: "Proximity Alert System",
      nameZh: "接近警報系統",
      icon: "Radio",
      sortOrder: 2,
      description:
        "UWB/RFID collision prevention between workers and plant machinery",
      descriptionZh: "UWB/RFID防碰撞系統，保護工人與機械設備安全距離",
    },
    {
      slug: "environmental-monitoring",
      name: "Environmental Monitoring",
      nameZh: "環境監測系統",
      icon: "Thermometer",
      sortOrder: 3,
      description:
        "Air quality, noise level, gas detection, and weather station systems",
      descriptionZh: "空氣質素、噪音、氣體偵測及氣象站系統",
    },
    {
      slug: "ai-surveillance",
      name: "AI Video Surveillance",
      nameZh: "AI智能影像監控",
      icon: "Camera",
      sortOrder: 4,
      description:
        "CCTV with AI for PPE detection and unsafe behavior alerts",
      descriptionZh: "配備AI的閉路電視，用於PPE偵測及不安全行為警報",
    },
    {
      slug: "access-control",
      name: "Site Access Control",
      nameZh: "工地出入管理系統",
      icon: "Fingerprint",
      sortOrder: 5,
      description:
        "Facial recognition, RFID cards, and biometric turnstile systems",
      descriptionZh: "人面辨識、RFID卡及生物識別閘機系統",
    },
    {
      slug: "lifting-operations",
      name: "Lifting Operations Monitoring",
      nameZh: "吊運作業監測系統",
      icon: "Construction",
      sortOrder: 6,
      description:
        "Crane load, angle, and wind sensors with anti-collision systems",
      descriptionZh: "吊機負載、角度、風速感測器及防碰撞系統",
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

  console.log("Creating sample products...");

  const productsData = [
    // Smart Helmet
    {
      categoryId: categories["smart-helmet"].id,
      slug: "sh-100-basic",
      name: "SH-100 Basic Smart Helmet",
      nameZh: "SH-100 基礎智能安全帽",
      shortDesc:
        "Entry-level smart helmet with fall detection and SOS alert",
      shortDescZh: "入門級智能安全帽，配備跌倒偵測及SOS警報",
      basePrice: 2800,
      pricingModel: "unit",
      isFeatured: true,
      leadTimeDays: 14,
      specifications: {
        Weight: "450g",
        Battery: "12 hours",
        Connectivity: "Bluetooth 5.0, 4G LTE",
        Sensors: "Accelerometer, Gyroscope, GPS",
      },
      hardwareList: [
        { name: "Smart Helmet Unit", nameZh: "智能安全帽主機", model: "SH-100", supplier: "Shenzhen IoT" },
        { name: "Charging Dock", nameZh: "充電底座", model: "CD-01", supplier: "Shenzhen IoT" },
      ],
    },
    {
      categoryId: categories["smart-helmet"].id,
      slug: "sh-200-pro",
      name: "SH-200 Pro Smart Helmet",
      nameZh: "SH-200 專業智能安全帽",
      shortDesc:
        "Advanced helmet with vital signs monitoring and gas detection",
      shortDescZh: "進階安全帽，配備生命體徵監測及氣體偵測",
      basePrice: 4500,
      pricingModel: "unit",
      isFeatured: false,
      leadTimeDays: 21,
      specifications: {
        Weight: "520g",
        Battery: "10 hours",
        Connectivity: "Bluetooth 5.0, 4G LTE, WiFi",
        Sensors: "Heart Rate, SpO2, Temperature, Gas Detector, GPS",
      },
      hardwareList: [
        { name: "Smart Helmet Pro Unit", nameZh: "專業智能安全帽主機", model: "SH-200", supplier: "Shenzhen IoT" },
        { name: "Charging Dock", nameZh: "充電底座", model: "CD-02", supplier: "Shenzhen IoT" },
        { name: "Base Station", nameZh: "基站", model: "BS-100", supplier: "Shenzhen IoT" },
      ],
    },

    // Proximity Alert
    {
      categoryId: categories["proximity-alert"].id,
      slug: "pa-uwb-100",
      name: "UWB Proximity Alert Kit",
      nameZh: "UWB接近警報套件",
      shortDesc:
        "Ultra-wideband positioning system for worker-machinery collision prevention",
      shortDescZh: "超寬頻定位系統，防止工人與機械碰撞",
      basePrice: 35000,
      pricingModel: "site",
      isFeatured: true,
      leadTimeDays: 30,
    },
    {
      categoryId: categories["proximity-alert"].id,
      slug: "pa-rfid-200",
      name: "RFID Zone Alert System",
      nameZh: "RFID區域警報系統",
      shortDesc:
        "RFID-based danger zone entry detection and alert system",
      shortDescZh: "基於RFID的危險區域進入偵測及警報系統",
      basePrice: 18000,
      pricingModel: "site",
      isFeatured: false,
      leadTimeDays: 21,
    },

    // Environmental Monitoring
    {
      categoryId: categories["environmental-monitoring"].id,
      slug: "em-station-pro",
      name: "Environmental Monitoring Station",
      nameZh: "環境監測站",
      shortDesc:
        "All-in-one weather and air quality monitoring station",
      shortDescZh: "一體化氣象及空氣質素監測站",
      basePrice: 25000,
      pricingModel: "unit",
      isFeatured: true,
      leadTimeDays: 14,
      demoUrl: "https://bim-pwa-app.vercel.app",
      demoType: "link",
    },
    {
      categoryId: categories["environmental-monitoring"].id,
      slug: "em-noise-100",
      name: "Smart Noise Monitor",
      nameZh: "智能噪音監測器",
      shortDesc:
        "Real-time noise level monitoring with auto-reporting",
      shortDescZh: "實時噪音監測及自動報告系統",
      basePrice: 8000,
      pricingModel: "unit",
      isFeatured: false,
      leadTimeDays: 10,
      demoUrl: "https://bim-pwa-app.vercel.app",
      demoType: "iframe",
    },

    // AI Surveillance
    {
      categoryId: categories["ai-surveillance"].id,
      slug: "ai-cam-360",
      name: "AI Safety Camera 360",
      nameZh: "AI安全攝像頭360",
      shortDesc:
        "360-degree AI camera with PPE and behavior detection",
      shortDescZh: "360度AI攝像頭，配備PPE及行為偵測",
      basePrice: 15000,
      pricingModel: "unit",
      isFeatured: false,
      leadTimeDays: 14,
    },
    {
      categoryId: categories["ai-surveillance"].id,
      slug: "ai-analytics-platform",
      name: "AI Analytics Platform",
      nameZh: "AI分析平台",
      shortDesc:
        "Cloud-based AI video analytics platform with dashboard",
      shortDescZh: "雲端AI影像分析平台連儀表板",
      basePrice: 8000,
      pricingModel: "monthly",
      isFeatured: false,
      leadTimeDays: 7,
      demoUrl: "https://bim-pwa-app.vercel.app",
      demoType: "iframe",
    },

    // Access Control
    {
      categoryId: categories["access-control"].id,
      slug: "ac-face-100",
      name: "Facial Recognition Terminal",
      nameZh: "人面辨識終端機",
      shortDesc:
        "Outdoor-rated facial recognition with temperature screening",
      shortDescZh: "戶外級人面辨識連體溫篩查",
      basePrice: 12000,
      pricingModel: "unit",
      isFeatured: false,
      leadTimeDays: 14,
    },
    {
      categoryId: categories["access-control"].id,
      slug: "ac-turnstile-pro",
      name: "Smart Turnstile System",
      nameZh: "智能閘機系統",
      shortDesc:
        "RFID + facial recognition turnstile with attendance tracking",
      shortDescZh: "RFID+人面辨識閘機連考勤追蹤",
      basePrice: 45000,
      pricingModel: "unit",
      isFeatured: false,
      leadTimeDays: 30,
    },

    // Lifting Operations
    {
      categoryId: categories["lifting-operations"].id,
      slug: "lo-crane-monitor",
      name: "Crane Safety Monitor",
      nameZh: "吊機安全監測器",
      shortDesc:
        "Real-time crane load, angle, and wind speed monitoring",
      shortDescZh: "實時吊機負載、角度及風速監測",
      basePrice: 55000,
      pricingModel: "unit",
      isFeatured: true,
      leadTimeDays: 30,
    },
    {
      categoryId: categories["lifting-operations"].id,
      slug: "lo-anti-collision",
      name: "Anti-Collision System",
      nameZh: "防碰撞系統",
      shortDesc:
        "Multi-crane anti-collision with 3D zone mapping",
      shortDescZh: "多吊機防碰撞系統連3D區域映射",
      basePrice: 120000,
      pricingModel: "site",
      isFeatured: false,
      leadTimeDays: 45,
    },
  ];

  await prisma.$transaction(
    productsData.map((product) =>
      prisma.portalProduct.create({ data: product })
    )
  );
  console.log(`  ${productsData.length} products created.\n`);

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
