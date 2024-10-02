-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_barn_id_fkey`;

-- AlterTable
ALTER TABLE `user` MODIFY `barnId` BIGINT NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_barn_id_fkey` FOREIGN KEY (`barnId`) REFERENCES `barn`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
