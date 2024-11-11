/*
  Warnings:

  - You are about to drop the column `userName` on the `ConfigHistory` table. All the data in the column will be lost.
  - Added the required column `userId` to the `ConfigHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ConfigHistory` DROP COLUMN `userName`,
    ADD COLUMN `userId` VARCHAR(155) NOT NULL;

-- AddForeignKey
ALTER TABLE `ConfigHistory` ADD CONSTRAINT `ConfigHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
