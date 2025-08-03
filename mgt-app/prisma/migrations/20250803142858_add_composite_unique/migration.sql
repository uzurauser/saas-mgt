/*
  Warnings:

  - A unique constraint covering the columns `[clientId,vendorServiceId,cspId,cspServiceId]` on the table `VendorServiceCspAssignment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `VendorServiceCspAssignment_clientId_vendorServiceId_cspId_cs_key` ON `VendorServiceCspAssignment`(`clientId`, `vendorServiceId`, `cspId`, `cspServiceId`);
