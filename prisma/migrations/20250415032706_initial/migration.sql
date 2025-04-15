-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT,
    "placement" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
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

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_assetNo_key" ON "Asset"("assetNo");
