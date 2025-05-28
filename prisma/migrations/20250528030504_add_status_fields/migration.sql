/*
  Warnings:

  - You are about to drop the column `detailsLocation` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `locationDesc` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `projectCode` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the `UserVersion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserVersion" DROP CONSTRAINT "UserVersion_userId_fkey";

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "detailsLocation",
DROP COLUMN "locationDesc",
DROP COLUMN "projectCode",
ADD COLUMN     "detailsLocation_id" INTEGER,
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "locationDesc_id" INTEGER,
ADD COLUMN     "projectCode_id" INTEGER,
ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "password";

-- DropTable
DROP TABLE "UserVersion";

-- CreateTable
CREATE TABLE "LocationDesc" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "LocationDesc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLocation" (
    "userId" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "UserLocation_pkey" PRIMARY KEY ("userId","locationId")
);

-- CreateTable
CREATE TABLE "ProjectCode" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(255) NOT NULL,

    CONSTRAINT "ProjectCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailsLocation" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "DetailsLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset_Copy" (
    "id" TEXT NOT NULL,
    "projectCode" TEXT NOT NULL,
    "assetNo" TEXT NOT NULL,
    "lineNo" TEXT NOT NULL,
    "assetName" TEXT NOT NULL,
    "remark" TEXT,
    "locationDesc" TEXT NOT NULL,
    "detailsLocation" TEXT,
    "condition" TEXT NOT NULL,
    "pisDate" TIMESTAMP(3) NOT NULL,
    "transDate" TIMESTAMP(3) NOT NULL,
    "categoryCode" TEXT NOT NULL,
    "afeNo" TEXT,
    "adjustedDepre" DOUBLE PRECISION NOT NULL,
    "poNo" TEXT,
    "acqValueIdr" DOUBLE PRECISION NOT NULL,
    "acqValue" DOUBLE PRECISION NOT NULL,
    "accumDepre" DOUBLE PRECISION NOT NULL,
    "ytdDepre" DOUBLE PRECISION NOT NULL,
    "bookValue" DOUBLE PRECISION NOT NULL,
    "taggingYear" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isLatest" BOOLEAN NOT NULL DEFAULT true,
    "parentId" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Asset_Copy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetAudit" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "checkDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locationId" INTEGER,
    "status" TEXT NOT NULL,
    "remarks" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditUser" (
    "auditId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "AuditUser_pkey" PRIMARY KEY ("auditId","userId")
);

-- CreateTable
CREATE TABLE "Inspection" (
    "id" TEXT NOT NULL,
    "inspector_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InspectionItem" (
    "id" TEXT NOT NULL,
    "inspectionId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "assetVersion" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InspectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LocationDesc_description_key" ON "LocationDesc"("description");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectCode_code_key" ON "ProjectCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "DetailsLocation_description_key" ON "DetailsLocation"("description");

-- CreateIndex
CREATE INDEX "Asset_Copy_assetNo_isLatest_idx" ON "Asset_Copy"("assetNo", "isLatest");

-- CreateIndex
CREATE INDEX "AssetAudit_assetId_idx" ON "AssetAudit"("assetId");

-- CreateIndex
CREATE INDEX "AssetAudit_checkDate_idx" ON "AssetAudit"("checkDate");

-- CreateIndex
CREATE INDEX "InspectionItem_inspectionId_idx" ON "InspectionItem"("inspectionId");

-- CreateIndex
CREATE INDEX "InspectionItem_assetId_idx" ON "InspectionItem"("assetId");

-- AddForeignKey
ALTER TABLE "UserLocation" ADD CONSTRAINT "UserLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "LocationDesc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLocation" ADD CONSTRAINT "UserLocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "fk_details_location" FOREIGN KEY ("detailsLocation_id") REFERENCES "DetailsLocation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "fk_location_desc" FOREIGN KEY ("locationDesc_id") REFERENCES "LocationDesc"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "fk_project_code" FOREIGN KEY ("projectCode_id") REFERENCES "ProjectCode"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "AssetAudit" ADD CONSTRAINT "AssetAudit_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAudit" ADD CONSTRAINT "AssetAudit_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "LocationDesc"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditUser" ADD CONSTRAINT "AuditUser_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "AssetAudit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditUser" ADD CONSTRAINT "AuditUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_inspector_id_fkey" FOREIGN KEY ("inspector_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InspectionItem" ADD CONSTRAINT "InspectionItem_inspectionId_fkey" FOREIGN KEY ("inspectionId") REFERENCES "Inspection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InspectionItem" ADD CONSTRAINT "InspectionItem_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
