/*
  Warnings:

  - A unique constraint covering the columns `[transactionId]` on the table `periodic` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "periodic_transactionId_key" ON "periodic"("transactionId");
