import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/hash";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hashPassword("admin123");

  await prisma.admin.upsert({
    where: {
      email: "admin@mediapprove.com",
    },
    update: {},
    create: {
      name: "Admin",
      email: "admin@mediapprove.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin created");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });