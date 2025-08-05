-- AlterTable
ALTER TABLE `SummaryOutsourcingServiceCspService` MODIFY `cspServiceCommonChecklistStatus` ENUM('not_created', 'completed', 'not_required', 'is_examined') NOT NULL DEFAULT 'not_created',
    MODIFY `cspServiceDetailChecklistStatus` ENUM('not_created', 'completed', 'not_required', 'is_examined') NOT NULL DEFAULT 'not_created';

-- AlterTable
ALTER TABLE `SummaryVendorService` MODIFY `vendorCommonChecklistStatus` ENUM('not_created', 'completed', 'not_required', 'is_examined') NOT NULL DEFAULT 'not_created',
    MODIFY `vendorDetailChecklistStatus` ENUM('not_created', 'completed', 'not_required', 'is_examined') NOT NULL DEFAULT 'not_created';

-- AlterTable
ALTER TABLE `SummaryVendorServiceCspService` MODIFY `vendorCommonChecklistStatus` ENUM('not_created', 'completed', 'not_required', 'is_examined') NOT NULL DEFAULT 'not_created',
    MODIFY `vendorDetailChecklistStatus` ENUM('not_created', 'completed', 'not_required', 'is_examined') NOT NULL DEFAULT 'not_created',
    MODIFY `cspCommonChecklistStatus` ENUM('not_created', 'completed', 'not_required', 'is_examined') NOT NULL DEFAULT 'not_created',
    MODIFY `cspDetailChecklistStatus` ENUM('not_created', 'completed', 'not_required', 'is_examined') NOT NULL DEFAULT 'not_created';
