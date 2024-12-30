/*
  Warnings:

  - Added the required column `userId` to the `splitDetails` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "splitDetails_transactionId_key";

-- AlterTable
ALTER TABLE "splitDetails" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "splitDetails" ADD CONSTRAINT "splitDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
