/*
  Warnings:

  - You are about to drop the column `firseDay` on the `Configs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Configs` DROP COLUMN `firseDay`,
    ADD COLUMN `firstDay` VARCHAR(3) NULL;
