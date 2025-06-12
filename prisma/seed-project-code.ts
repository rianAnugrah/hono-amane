import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const projectCodesData = [
  { id:1,code: "Common" },
  { id:2,code: "Gas1" },
  { id:3,code: "n/a" },
];

export async function seedProjectCodes() {
  let created = 0;
  let skipped = 0;

  for (const project of projectCodesData) {
    try {
      const existing = await prisma.projectCode.findUnique({
        where: { code: project.code },
      });

      if (existing) {
        console.log(`⏭️  Skipped: ProjectCode "${project.code}" already exists (id: ${existing.id})`);
        skipped++;
        continue;
      }

      await prisma.projectCode.create({ data: project });
      console.log(`✅ Created: ProjectCode "${project.code}"`);
      created++;
    } catch (error) {
      console.error(`❌ Error creating "${project.code}":`, error);
    }
  }

  console.log(`\n📦 Seeding complete. Created: ${created}, Skipped: ${skipped}`);
}

seedProjectCodes()
  .catch((e) => {
    console.error("🔥 Fatal error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
