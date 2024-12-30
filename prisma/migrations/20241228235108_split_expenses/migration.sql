-- CreateEnum
CREATE TYPE "SplitType" AS ENUM ('EQUAL', 'UNEQUAL');

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "isSplit" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "splitDetails" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "splitType" "SplitType" NOT NULL,
    "participants" JSONB NOT NULL,

    CONSTRAINT "splitDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "splitDetails_transactionId_key" ON "splitDetails"("transactionId");

-- CreateIndex
CREATE INDEX "splitDetails_id_idx" ON "splitDetails"("id");

-- AddForeignKey
ALTER TABLE "splitDetails" ADD CONSTRAINT "splitDetails_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
