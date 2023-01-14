/*
  Warnings:

  - You are about to drop the column `cashBalance` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `equityBalance` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `fixedIncomeBal` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `accountRepId` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `custodyAccountId` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('client', 'admin');

-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Trade" DROP CONSTRAINT "Trade_clientId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_clientId_fkey";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "cashBalance",
DROP COLUMN "equityBalance",
DROP COLUMN "fixedIncomeBal",
ADD COLUMN     "accountRepId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "clientId",
ADD COLUMN     "custodyAccountId" TEXT NOT NULL,
ALTER COLUMN "settlementAmt" SET DATA TYPE BIGINT,
ALTER COLUMN "onTime" DROP NOT NULL,
ALTER COLUMN "onTime" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "clientId",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'client',
ADD COLUMN     "userClientId" TEXT;

-- DropTable
DROP TABLE "Admin";

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "cashBalance" BIGINT NOT NULL,
    "equityBalance" BIGINT NOT NULL,
    "fixedIncomeBal" BIGINT NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_clientId_key" ON "Account"("clientId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userClientId_fkey" FOREIGN KEY ("userClientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_accountRepId_fkey" FOREIGN KEY ("accountRepId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_custodyAccountId_fkey" FOREIGN KEY ("custodyAccountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
