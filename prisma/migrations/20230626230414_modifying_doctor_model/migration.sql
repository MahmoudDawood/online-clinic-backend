/*
  Warnings:

  - Added the required column `gender` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workingHoursEnd` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workingHoursStart` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "gender" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "workingHoursEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "workingHoursStart" TIMESTAMP(3) NOT NULL;
