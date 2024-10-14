/*
  Warnings:

  - You are about to drop the column `barnId` on the `user` table. All the data in the column will be lost.
  - Added the required column `UserId` to the `barn` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_barn_id_fkey`;

-- AlterTable
ALTER TABLE `barn` ADD COLUMN `UserId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `barnId`;

-- AddForeignKey
ALTER TABLE `barn` ADD CONSTRAINT `barn_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
