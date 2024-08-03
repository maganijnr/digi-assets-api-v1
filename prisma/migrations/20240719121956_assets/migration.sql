/*
  Warnings:

  - Added the required column `price_type` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "price_type" TEXT NOT NULL;
