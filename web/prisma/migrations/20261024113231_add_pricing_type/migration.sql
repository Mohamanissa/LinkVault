/*
  Warnings:

  - You are about to drop the column `isPaid` on the `Link` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Link" DROP COLUMN "isPaid",
ADD COLUMN     "pricingType" TEXT NOT NULL DEFAULT 'free';
