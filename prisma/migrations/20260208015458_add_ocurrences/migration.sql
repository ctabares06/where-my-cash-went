/*
  Warnings:

  - Added the required column `nextOcurrence` to the `periodic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "periodic" ADD COLUMN     "nextOcurrence" TIMESTAMP(3) NOT NULL;
