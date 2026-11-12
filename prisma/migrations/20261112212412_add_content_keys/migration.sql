-- AlterTable
ALTER TABLE `ConversationStarter` ADD COLUMN `key` VARCHAR(80) NOT NULL;

-- AlterTable
ALTER TABLE `EducationalResource` ADD COLUMN `slug` VARCHAR(80) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ConversationStarter_key_key` ON `ConversationStarter`(`key`);

-- CreateIndex
CREATE UNIQUE INDEX `EducationalResource_slug_key` ON `EducationalResource`(`slug`);

