import { PrismaClient, Role, MedicineStatus } from "@prisma/client";
import { hashPassword } from "../lib/hash";

const prisma = new PrismaClient();

async function main() {
  // Create admin
  const hashedPassword = await hashPassword("admin123");

  await prisma.user.upsert({
    where: {
      email: "raina@mediapprove.com",
    },
    update: {},
    create: {
      name: "Raina",
      email: "raina@mediapprove.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: {
      email: "vinayak@mediapprove.com",
    },
    update: {},
    create: {
      name: "Vinayak",
      email: "vinayak@mediapprove.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: {
      email: "demo@gmail.com",
    },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@gmail.com",
      password: hashedPassword,
      role: Role.USER,
    },
  });

  console.log("Seed users created");

  // Create sample medicines
  await prisma.medicineListing.createMany({
    data: [
      {
        medicineName: "Paracetamol 500mg",
        sku: "MED001",
        formulation: "Tablet",
        price: 25,
        expiryDate: new Date("2028-12-31"),
        vendor: "ABC Pharma",
        status: MedicineStatus.PENDING,
      },
      {
        medicineName: "Amoxicillin 250mg",
        sku: "MED002",
        formulation: "Capsule",
        price: 120,
        expiryDate: new Date("2027-10-20"),
        vendor: "XYZ Pharma",
        status: MedicineStatus.PENDING,
      },
      {
        medicineName: "Cetirizine 10mg",
        sku: "MED003",
        formulation: "Tablet",
        price: 40,
        expiryDate: new Date("2029-05-15"),
        vendor: "Cipla",
        status: MedicineStatus.PENDING,
      },
      {
        medicineName: "Azithromycin 500mg",
        sku: "MED004",
        formulation: "Tablet",
        price: 180,
        expiryDate: new Date("2028-08-18"),
        vendor: "Sun Pharma",
        status: MedicineStatus.PENDING,
      },
      {
        medicineName: "Vitamin C",
        sku: "MED005",
        formulation: "Tablet",
        price: 90,
        expiryDate: new Date("2029-01-01"),
        vendor: "Himalaya",
        status: MedicineStatus.PENDING,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Medicine records created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });