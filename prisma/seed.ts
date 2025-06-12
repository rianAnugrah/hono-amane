import { PrismaClient } from "@prisma/client";
import { seedHBI } from "./seed-hbi";
import { seedHBM } from "./seed-hbm";
import { seedDetailLocation } from "./seed-detail-location";
import { seedLocations } from "./seed-location";
import { seedUsers } from "./seed-users";
import { seedProjectCodes } from "./seed-project-code";
const prisma = new PrismaClient();

async function main() {
  await seedProjectCodes()
  await seedDetailLocation();
  await seedLocations();
  await seedUsers();
  await seedHBI(prisma);
  await seedHBM(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
