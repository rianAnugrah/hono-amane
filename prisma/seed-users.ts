import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function seedUsers() {
  console.log("\n🌱 Starting User seeding...");

  const data = [
    {
      id: "51f968b8-e4c5-4c60-bfee-46f042173324",
      email: "andari_pujihapsari@hcml.co.id",
      name: "Andari Pujihapsari",
      role: "lead",
      placement: null,
      createdAt: new Date("2025-05-28T04:01:50.226Z"),
      updatedAt: new Date("2025-06-10T08:13:47.737Z"),
      deletedAt: null,
    },
    {
      id: "81da9c4e-9764-420f-88eb-8c98c4beac83",
      email: "rian_anugrah@hcml.co.id",
      name: "Rian Anugrah",
      role: "admin",
      placement: null,
      createdAt: new Date("2025-05-28T04:00:00.894Z"),
      updatedAt: new Date("2025-06-09T01:43:41.166Z"),
      deletedAt: null,
    },
    {
      id: "ed9380c4-9798-46d6-aaca-b27d1e17425b",
      email: "SUGENG_MULYONO@HCML.CO.ID",
      name: "SUGENG MULYONO",
      role: "admin",
      placement: null,
      createdAt: new Date("2025-06-10T03:45:31.608Z"),
      updatedAt: new Date("2025-06-10T05:36:12.732Z"),
      deletedAt: null,
    },
  ];

  console.log(`👤 Total user records to insert: ${data.length}`);

  const result = await prisma.users.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`✅ Inserted ${result.count} new users (skipped duplicates).`);
  console.log("✅ User seeding complete.\n");
}
