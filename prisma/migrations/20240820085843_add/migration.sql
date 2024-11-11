/*
  Warnings:

  - You are about to drop the column `firseTime` on the `Configs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Configs` DROP COLUMN `firseTime`,
    ADD COLUMN `firstTime` VARCHAR(4) NULL;
