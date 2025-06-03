import { PrismaClient } from "@prisma/client";
import { assetsData } from "./asset-data";
const prisma = new PrismaClient();

function parseFloatSafe(val: string): number {
  const num = parseFloat(val.replace(/,/g, "").trim());
  return isNaN(num) ? 0 : num;
}

function parseDateSafe(dateStr: string): Date {
  const [month, day, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}`);
}

async function main() {
  const assets = assetsData

  for (const asset of assets) {
    try {
      // Check if a latest version of the asset already exists
      const existingAsset = await prisma.asset.findFirst({
        where: {
          assetNo: asset.assetNo,
          isLatest: true,
        },
      });

      if (existingAsset) {
        console.log(
          `Skipping asset ${asset.assetNo}-${asset.lineNo}: Already exists (version ${existingAsset.version})`
        );
        continue;
      }

      // Create the first version of this asset
      await prisma.asset.create({
        data: {
          version: 1,
          isLatest: true,
          projectCode: asset.projectCode_id ? {
            connect: { id: asset.projectCode_id }
          } : undefined,
          assetNo: asset.assetNo,
          lineNo: asset.lineNo,
          assetName: asset.assetName,
          remark: asset.remark || null,
          locationDesc: asset.locationDesc_id ? {
            connect: { id: asset.locationDesc_id }
          } : undefined,
          detailsLocation: asset.detailsLocation_id ? {
            connect: { id: asset.detailsLocation_id }
          } : undefined,
          condition: asset.condition,
          pisDate: asset.pisDate,
          transDate: asset.transDate,
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
        },
      });

      console.log(`Created asset ${asset.assetNo}-${asset.lineNo}`);
    } catch (error: unknown) {
      console.error(
        `Error processing asset ${asset.assetNo}-${asset.lineNo}:`,
        error instanceof Error ? error.message : String(error)
      );
    }
  }
}

main()
  .then(() => {
    console.log("Seeding complete");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
