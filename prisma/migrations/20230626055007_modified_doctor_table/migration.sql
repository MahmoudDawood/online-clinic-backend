/*
  Warnings:

  - You are about to drop the column `price1` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `price2` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `subSpecialization` on the `Doctor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "price1",
DROP COLUMN "price2",
DROP COLUMN "subSpecialization",
ADD COLUMN     "visitFee" DOUBLE PRECISION;
