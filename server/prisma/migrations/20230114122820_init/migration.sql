-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_accountRepId_fkey";

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "accountRepId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_accountRepId_fkey" FOREIGN KEY ("accountRepId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
