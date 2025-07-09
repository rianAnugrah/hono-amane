import { PrismaClient } from "@prisma/client";
import { seedHBI } from "./seed-hbi";
import { seedHBM } from "./seed-hbm";
import { seedDetailLocation } from "./seed-detail-location";
import { seedLocations } from "./seed-location";
import { seedUsers } from "./seed-users";
import { seedProjectCodes } from "./seed-project-code";

const prisma = new PrismaClient();

async function main() {
  // Cek apakah sudah pernah di-seed
  const existingUser = await prisma.users.findFirst();
  if (existingUser) {
    console.log("✅ Seed already exists. Skipping...");
    return;
  }

  console.log("🌱 Seeding database...");
  await seedProjectCodes();
  await seedDetailLocation();
  await seedLocations();
  await seedUsers();
  await seedHBI(prisma);
  await seedHBM(prisma);
  console.log("✅ Seeding complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
