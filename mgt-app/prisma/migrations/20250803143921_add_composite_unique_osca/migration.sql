/*
  Warnings:

  - A unique constraint covering the columns `[clientId,outsourcingServiceId,cspId,cspServiceId]` on the table `OutsourcingServiceCspAssignment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `OutsourcingServiceCspAssignment_clientId_outsourcingServiceI_key` ON `OutsourcingServiceCspAssignment`(`clientId`, `outsourcingServiceId`, `cspId`, `cspServiceId`);
