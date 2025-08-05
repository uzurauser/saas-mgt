-- CreateTable
CREATE TABLE `Client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Client_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vendor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `antisocialCheckStatus` ENUM('unchecked', 'checked', 'check_exception', 'monitor_checked') NOT NULL DEFAULT 'unchecked',

    UNIQUE INDEX `Vendor_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VendorService` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `vendorId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VendorService_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Csp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `antisocialCheckStatus` ENUM('unchecked', 'checked', 'check_exception', 'monitor_checked') NOT NULL DEFAULT 'unchecked',

    UNIQUE INDEX `Csp_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CspService` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `cspId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CspService_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OutsourcingPartner` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `antisocialCheckStatus` ENUM('unchecked', 'checked', 'check_exception', 'monitor_checked') NOT NULL DEFAULT 'unchecked',

    UNIQUE INDEX `OutsourcingPartner_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OutsourcingService` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `outsourcingPartnerId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `OutsourcingService_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cycle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Cycle_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SummaryVendorService` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cycleId` INTEGER NOT NULL,
    `clientId` INTEGER NOT NULL,
    `vendorId` INTEGER NOT NULL,
    `vendorServiceId` INTEGER NOT NULL,
    `vendorAntisocialCheckStatus` ENUM('unchecked', 'checked', 'check_exception', 'monitor_checked') NOT NULL DEFAULT 'unchecked',
    `vendorCommonChecklistStatus` ENUM('not_created', 'completed', 'not_required', 'is_examined') NOT NULL,
    `vendorDetailChecklistStatus` ENUM('not_created', 'completed', 'not_required', 'is_examined') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SummaryVendorService_clientId_vendorServiceId_key`(`clientId`, `vendorServiceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SummaryVendorServiceCspService` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cycleId` INTEGER NOT NULL,
    `clientId` INTEGER NOT NULL,
    `vendorId` INTEGER NOT NULL,
    `vendorServiceId` INTEGER NOT NULL,
    `cspId` INTEGER NOT NULL,
    `cspServiceId` INTEGER NOT NULL,
    `vendorAntisocialCheckStatus` ENUM('unchecked', 'checked', 'check_exception', 'monitor_checked') NOT NULL DEFAULT 'unchecked',
    `vendorCommonChecklistStatus` ENUM('not_created', 'completed', 'not_required', 'is_examined') NOT NULL,
    `vendorDetailChecklistStatus` ENUM('not_created', 'completed', 'not_required', 'is_examined') NOT NULL,
    `cspAntisocialCheckStatus` ENUM('unchecked', 'checked', 'check_exception', 'monitor_checked') NOT NULL DEFAULT 'unchecked',
    `cspCommonChecklistStatus` ENUM('not_created', 'completed', 'not_required', 'is_examined') NOT NULL,
    `cspDetailChecklistStatus` ENUM('not_created', 'completed', 'not_required', 'is_examined') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SummaryVendorServiceCspService_clientId_vendorServiceId_cspS_key`(`clientId`, `vendorServiceId`, `cspServiceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SummaryOutsourcingServiceCspService` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cycleId` INTEGER NOT NULL,
    `clientId` INTEGER NOT NULL,
    `outsourcingPartnerId` INTEGER NOT NULL,
    `outsourcingServiceId` INTEGER NOT NULL,
    `cspId` INTEGER NOT NULL,
    `cspServiceId` INTEGER NOT NULL,
    `outsourcingPartnerAntisocialCheckStatus` ENUM('unchecked', 'checked', 'check_exception', 'monitor_checked') NOT NULL DEFAULT 'unchecked',
    `cspAntisocialCheckStatus` ENUM('unchecked', 'checked', 'check_exception', 'monitor_checked') NOT NULL DEFAULT 'unchecked',
    `cspServiceCommonChecklistStatus` ENUM('not_created', 'completed', 'not_required', 'is_examined') NOT NULL,
    `cspServiceDetailChecklistStatus` ENUM('not_created', 'completed', 'not_required', 'is_examined') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SummaryOutsourcingServiceCspService_clientId_outsourcingServ_key`(`clientId`, `outsourcingServiceId`, `cspServiceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VendorService` ADD CONSTRAINT `VendorService_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CspService` ADD CONSTRAINT `CspService_cspId_fkey` FOREIGN KEY (`cspId`) REFERENCES `Csp`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OutsourcingService` ADD CONSTRAINT `OutsourcingService_outsourcingPartnerId_fkey` FOREIGN KEY (`outsourcingPartnerId`) REFERENCES `OutsourcingPartner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SummaryVendorService` ADD CONSTRAINT `SummaryVendorService_cycleId_fkey` FOREIGN KEY (`cycleId`) REFERENCES `Cycle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SummaryVendorService` ADD CONSTRAINT `SummaryVendorService_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SummaryVendorService` ADD CONSTRAINT `SummaryVendorService_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SummaryVendorService` ADD CONSTRAINT `SummaryVendorService_vendorServiceId_fkey` FOREIGN KEY (`vendorServiceId`) REFERENCES `VendorService`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SummaryVendorServiceCspService` ADD CONSTRAINT `SummaryVendorServiceCspService_cycleId_fkey` FOREIGN KEY (`cycleId`) REFERENCES `Cycle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SummaryVendorServiceCspService` ADD CONSTRAINT `SummaryVendorServiceCspService_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SummaryVendorServiceCspService` ADD CONSTRAINT `SummaryVendorServiceCspService_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SummaryVendorServiceCspService` ADD CONSTRAINT `SummaryVendorServiceCspService_vendorServiceId_fkey` FOREIGN KEY (`vendorServiceId`) REFERENCES `VendorService`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SummaryVendorServiceCspService` ADD CONSTRAINT `SummaryVendorServiceCspService_cspId_fkey` FOREIGN KEY (`cspId`) REFERENCES `Csp`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SummaryVendorServiceCspService` ADD CONSTRAINT `SummaryVendorServiceCspService_cspServiceId_fkey` FOREIGN KEY (`cspServiceId`) REFERENCES `CspService`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SummaryOutsourcingServiceCspService` ADD CONSTRAINT `SummaryOutsourcingServiceCspService_cycleId_fkey` FOREIGN KEY (`cycleId`) REFERENCES `Cycle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SummaryOutsourcingServiceCspService` ADD CONSTRAINT `SummaryOutsourcingServiceCspService_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SummaryOutsourcingServiceCspService` ADD CONSTRAINT `SummaryOutsourcingServiceCspService_outsourcingPartnerId_fkey` FOREIGN KEY (`outsourcingPartnerId`) REFERENCES `OutsourcingPartner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SummaryOutsourcingServiceCspService` ADD CONSTRAINT `SummaryOutsourcingServiceCspService_outsourcingServiceId_fkey` FOREIGN KEY (`outsourcingServiceId`) REFERENCES `OutsourcingService`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SummaryOutsourcingServiceCspService` ADD CONSTRAINT `SummaryOutsourcingServiceCspService_cspId_fkey` FOREIGN KEY (`cspId`) REFERENCES `Csp`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SummaryOutsourcingServiceCspService` ADD CONSTRAINT `SummaryOutsourcingServiceCspService_cspServiceId_fkey` FOREIGN KEY (`cspServiceId`) REFERENCES `CspService`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
