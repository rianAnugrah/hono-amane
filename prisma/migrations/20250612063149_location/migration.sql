-- AlterTable
ALTER TABLE "Inspection" ADD COLUMN     "locationDesc_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "fk_location_desc" FOREIGN KEY ("locationDesc_id") REFERENCES "LocationDesc"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
