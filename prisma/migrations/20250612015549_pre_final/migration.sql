/*
  Warnings:

  - You are about to drop the `AssetAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Asset_Copy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuditUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AssetAudit" DROP CONSTRAINT "AssetAudit_assetId_fkey";

-- DropForeignKey
ALTER TABLE "AssetAudit" DROP CONSTRAINT "AssetAudit_locationId_fkey";

-- DropForeignKey
ALTER TABLE "AuditUser" DROP CONSTRAINT "AuditUser_auditId_fkey";

-- DropForeignKey
ALTER TABLE "AuditUser" DROP CONSTRAINT "AuditUser_userId_fkey";

-- AlterTable
ALTER TABLE "Inspection" ADD COLUMN     "head_signature_data" TEXT,
ADD COLUMN     "head_signature_timestamp" TIMESTAMP(3),
ADD COLUMN     "head_user_id" TEXT,
ADD COLUMN     "lead_signature_data" TEXT,
ADD COLUMN     "lead_signature_timestamp" TIMESTAMP(3),
ADD COLUMN     "lead_user_id" TEXT;

-- DropTable
DROP TABLE "AssetAudit";

-- DropTable
DROP TABLE "Asset_Copy";

-- DropTable
DROP TABLE "AuditUser";

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_lead_user_id_fkey" FOREIGN KEY ("lead_user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_head_user_id_fkey" FOREIGN KEY ("head_user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
