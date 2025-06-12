import { PrismaClient } from "@prisma/client"
import { assetsData } from "./asset-data-hbm"
import chalk from "chalk"

const prisma = new PrismaClient()

export async function seedHBM(prisma: PrismaClient) {
  console.log(chalk.blueBright("\n🔄 Starting HBM asset seeding..."))
  const startTime = Date.now()

  const assets = assetsData
  let successCount = 0
  let skippedCount = 0
  let errorCount = 0

  for (const [index, asset] of assets.entries()) {
    const progress = `[${index + 1}/${assets.length}]`

    try {
      const existingAsset = await prisma.asset.findFirst({
        where: {
          assetNo: asset.assetNo,
          isLatest: true,
        },
      })

      if (existingAsset) {
        console.log(
          chalk.yellow(
            `${progress} Skipped asset ${asset.assetNo}-${asset.lineNo} (already exists, version ${existingAsset.version})`
          )
        )
        skippedCount++
        continue
      }

      await prisma.asset.create({
        data: {
          version: 1,
          isLatest: true,
          projectCode_id: asset.projectCode_id,
          assetNo: asset.assetNo,
          lineNo: asset.lineNo,
          assetName: asset.assetName,
          remark: asset.remark || null,
          locationDesc_id: asset.locationDesc_id,
          detailsLocation_id: asset.detailsLocation_id,
          condition: asset.condition,
          pisDate: asset.pisDate || new Date(),
          transDate: asset.transDate || new Date(),
          categoryCode: asset.categoryCode,
          afeNo: asset.afeNo === "N/A" ? null : String(asset.afeNo),
          adjustedDepre: asset.adjustedDepre,
          poNo: asset.poNo === "N/A" ? null : String(asset.poNo),
          acqValueIdr: asset.acqValueIdr,
          acqValue: asset.acqValue,
          accumDepre: asset.accumDepre,
          ytdDepre: asset.ytdDepre,
          bookValue: asset.bookValue,
          taggingYear: asset.taggingYear || null,
          type: asset.type,
        },
      })

      console.log(
        chalk.green(`${progress} Created asset ${asset.assetNo}-${asset.lineNo}`)
      )
      successCount++
    } catch (error: unknown) {
      console.error(
        chalk.red(`${progress} Error processing asset ${asset.assetNo}-${asset.lineNo}:`),
        error instanceof Error ? error.message : String(error)
      )
      errorCount++
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2)

  console.log(chalk.blueBright("\n✅ HBM asset seeding complete."))
  console.log(chalk.green(`➕ Success  : ${successCount}`))
  console.log(chalk.yellow(`🔁 Skipped : ${skippedCount}`))
  console.log(chalk.red(`❌ Errors  : ${errorCount}`))
  console.log(chalk.cyan(`⏱️  Duration : ${duration} seconds\n`))
}

seedHBM(prisma)
  .then(() => {
    console.log(chalk.magenta("🌱 Done seeding all HBM assets"))
  })
  .catch((e) => {
    console.error(chalk.bgRed.white("Seeding failed:"), e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
