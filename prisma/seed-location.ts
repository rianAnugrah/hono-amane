import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function seedLocations() {
  console.log('\n🌱 Starting Location seeding...')

  const data = [
    { id: 1, description: "GMS Pasuruan" },
    { id: 2, description: "BD WHP" },
    { id: 3, description: "MDA - MBH Development Wells" },
    { id: 4, description: "MDA - MBH WHP" },
    { id: 5, description: "MAC" },
    { id: 6, description: "Jakarta Office" },
    { id: 7, description: "Banyuwangi Shorebase" },
    { id: 8, description: "BD Subsea Pipeline" },
    { id: 9, description: "Surabaya Office" },
    { id: 10, description: "BD Development Wells" },
    { id: 11, description: "Sampang Shorebase" },
    { id: 12, description: "Storage (Sigma)" },
  ]

  console.log(`🔢 Total project records to insert: ${data.length}`)

  const result = await prisma.locationDesc.createMany({
    data,
    skipDuplicates: true,
  })

  console.log(`✅ Inserted ${result.count} new records (skipped duplicates).`)
  console.log('✅ Project seeding complete.\n')
}
