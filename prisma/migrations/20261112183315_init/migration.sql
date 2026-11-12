-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `authProviderId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(60) NOT NULL,
    `role` ENUM('PARENT', 'TEEN') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_authProviderId_key`(`authProviderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Family` (
    `id` VARCHAR(191) NOT NULL,
    `parentId` VARCHAR(191) NOT NULL,
    `teenId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Family_parentId_key`(`parentId`),
    UNIQUE INDEX `Family_teenId_key`(`teenId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvitationCode` (
    `id` VARCHAR(191) NOT NULL,
    `familyId` VARCHAR(191) NOT NULL,
    `codeHash` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'REDEEMED', 'REVOKED', 'EXPIRED') NOT NULL DEFAULT 'ACTIVE',
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `redeemedById` VARCHAR(191) NULL,

    UNIQUE INDEX `InvitationCode_codeHash_key`(`codeHash`),
    INDEX `InvitationCode_familyId_status_idx`(`familyId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RedemptionAttempt` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `success` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `RedemptionAttempt_userId_createdAt_idx`(`userId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JournalEntry` (
    `id` VARCHAR(191) NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(100) NULL,
    `body` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `JournalEntry_ownerId_createdAt_idx`(`ownerId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeelingsCheckIn` (
    `id` VARCHAR(191) NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,
    `feeling` ENUM('HAPPY', 'CALM', 'EXCITED', 'WORRIED', 'SAD', 'ANGRY', 'STRESSED', 'CONFUSED') NOT NULL,
    `note` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `FeelingsCheckIn_ownerId_createdAt_idx`(`ownerId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EducationalResource` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('GUIDE', 'SENSITIVE_TOPIC', 'SCENARIO', 'OPENER', 'TEEN_STORY') NOT NULL,
    `audience` ENUM('PARENT', 'TEEN', 'BOTH') NOT NULL,
    `category` VARCHAR(60) NOT NULL,
    `title` VARCHAR(160) NOT NULL,
    `body` TEXT NOT NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `EducationalResource_type_isPublished_idx`(`type`, `isPublished`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConversationStarter` (
    `id` VARCHAR(191) NOT NULL,
    `text` VARCHAR(300) NOT NULL,
    `category` VARCHAR(60) NOT NULL,
    `resourceId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConversationRecord` (
    `id` VARCHAR(191) NOT NULL,
    `familyId` VARCHAR(191) NOT NULL,
    `recordedById` VARCHAR(191) NOT NULL,
    `starterId` VARCHAR(191) NULL,
    `completedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ConversationRecord_familyId_completedAt_idx`(`familyId`, `completedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Family` ADD CONSTRAINT `Family_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Family` ADD CONSTRAINT `Family_teenId_fkey` FOREIGN KEY (`teenId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvitationCode` ADD CONSTRAINT `InvitationCode_familyId_fkey` FOREIGN KEY (`familyId`) REFERENCES `Family`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvitationCode` ADD CONSTRAINT `InvitationCode_redeemedById_fkey` FOREIGN KEY (`redeemedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RedemptionAttempt` ADD CONSTRAINT `RedemptionAttempt_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JournalEntry` ADD CONSTRAINT `JournalEntry_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeelingsCheckIn` ADD CONSTRAINT `FeelingsCheckIn_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConversationStarter` ADD CONSTRAINT `ConversationStarter_resourceId_fkey` FOREIGN KEY (`resourceId`) REFERENCES `EducationalResource`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConversationRecord` ADD CONSTRAINT `ConversationRecord_familyId_fkey` FOREIGN KEY (`familyId`) REFERENCES `Family`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConversationRecord` ADD CONSTRAINT `ConversationRecord_recordedById_fkey` FOREIGN KEY (`recordedById`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConversationRecord` ADD CONSTRAINT `ConversationRecord_starterId_fkey` FOREIGN KEY (`starterId`) REFERENCES `ConversationStarter`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
