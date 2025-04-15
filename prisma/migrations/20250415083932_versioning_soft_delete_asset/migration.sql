-- DropIndex
DROP INDEX "Asset_assetNo_key";

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "isLatest" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE INDEX "Asset_assetNo_isLatest_idx" ON "Asset"("assetNo", "isLatest");
