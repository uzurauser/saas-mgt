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
    INDEX `VendorService_vendorId_idx`(`vendorId`),
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
    INDEX `CspService_cspId_idx`(`cspId`),
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
    INDEX `OutsourcingService_outsourcingPartnerId_idx`(`outsourcingPartnerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientVendor` (
    `clientId` INTEGER NOT NULL,
    `vendorId` INTEGER NOT NULL,

    INDEX `ClientVendor_vendorId_idx`(`vendorId`),
    PRIMARY KEY (`clientId`, `vendorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientCsp` (
    `clientId` INTEGER NOT NULL,
    `cspId` INTEGER NOT NULL,

    INDEX `ClientCsp_cspId_idx`(`cspId`),
    PRIMARY KEY (`cspId`, `clientId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientOutsourcingPartner` (
    `clientId` INTEGER NOT NULL,
    `outsourcingPartnerId` INTEGER NOT NULL,

    INDEX `ClientOutsourcingPartner_outsourcingPartnerId_idx`(`outsourcingPartnerId`),
    PRIMARY KEY (`clientId`, `outsourcingPartnerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VendorServiceCspAssignment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clientId` INTEGER NOT NULL,
    `vendorId` INTEGER NOT NULL,
    `vendorServiceId` INTEGER NOT NULL,
    `cspId` INTEGER NOT NULL,
    `cspServiceId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `VendorServiceCspAssignment_clientId_idx`(`clientId`),
    INDEX `VendorServiceCspAssignment_cspId_idx`(`cspId`),
    INDEX `VendorServiceCspAssignment_cspServiceId_idx`(`cspServiceId`),
    INDEX `VendorServiceCspAssignment_vendorId_idx`(`vendorId`),
    INDEX `VendorServiceCspAssignment_vendorServiceId_idx`(`vendorServiceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OutsourcingServiceCspAssignment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clientId` INTEGER NOT NULL,
    `outsourcingPartnerId` INTEGER NOT NULL,
    `outsourcingServiceId` INTEGER NOT NULL,
    `cspId` INTEGER NOT NULL,
    `cspServiceId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `OutsourcingServiceCspAssignment_clientId_idx`(`clientId`),
    INDEX `OutsourcingServiceCspAssignment_cspId_idx`(`cspId`),
    INDEX `OutsourcingServiceCspAssignment_cspServiceId_idx`(`cspServiceId`),
    INDEX `OutsourcingServiceCspAssignment_outsourcingPartnerId_idx`(`outsourcingPartnerId`),
    INDEX `OutsourcingServiceCspAssignment_outsourcingServiceId_idx`(`outsourcingServiceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VendorService` ADD CONSTRAINT `VendorService_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CspService` ADD CONSTRAINT `CspService_cspId_fkey` FOREIGN KEY (`cspId`) REFERENCES `Csp`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OutsourcingService` ADD CONSTRAINT `OutsourcingService_outsourcingPartnerId_fkey` FOREIGN KEY (`outsourcingPartnerId`) REFERENCES `OutsourcingPartner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientVendor` ADD CONSTRAINT `ClientVendor_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientVendor` ADD CONSTRAINT `ClientVendor_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientCsp` ADD CONSTRAINT `ClientCsp_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientCsp` ADD CONSTRAINT `ClientCsp_cspId_fkey` FOREIGN KEY (`cspId`) REFERENCES `Csp`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientOutsourcingPartner` ADD CONSTRAINT `ClientOutsourcingPartner_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientOutsourcingPartner` ADD CONSTRAINT `ClientOutsourcingPartner_outsourcingPartnerId_fkey` FOREIGN KEY (`outsourcingPartnerId`) REFERENCES `OutsourcingPartner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendorServiceCspAssignment` ADD CONSTRAINT `VendorServiceCspAssignment_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendorServiceCspAssignment` ADD CONSTRAINT `VendorServiceCspAssignment_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendorServiceCspAssignment` ADD CONSTRAINT `VendorServiceCspAssignment_vendorServiceId_fkey` FOREIGN KEY (`vendorServiceId`) REFERENCES `VendorService`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendorServiceCspAssignment` ADD CONSTRAINT `VendorServiceCspAssignment_cspId_fkey` FOREIGN KEY (`cspId`) REFERENCES `Csp`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendorServiceCspAssignment` ADD CONSTRAINT `VendorServiceCspAssignment_cspServiceId_fkey` FOREIGN KEY (`cspServiceId`) REFERENCES `CspService`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OutsourcingServiceCspAssignment` ADD CONSTRAINT `OutsourcingServiceCspAssignment_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OutsourcingServiceCspAssignment` ADD CONSTRAINT `OutsourcingServiceCspAssignment_outsourcingPartnerId_fkey` FOREIGN KEY (`outsourcingPartnerId`) REFERENCES `OutsourcingPartner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OutsourcingServiceCspAssignment` ADD CONSTRAINT `OutsourcingServiceCspAssignment_outsourcingServiceId_fkey` FOREIGN KEY (`outsourcingServiceId`) REFERENCES `OutsourcingService`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OutsourcingServiceCspAssignment` ADD CONSTRAINT `OutsourcingServiceCspAssignment_cspId_fkey` FOREIGN KEY (`cspId`) REFERENCES `Csp`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OutsourcingServiceCspAssignment` ADD CONSTRAINT `OutsourcingServiceCspAssignment_cspServiceId_fkey` FOREIGN KEY (`cspServiceId`) REFERENCES `CspService`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
