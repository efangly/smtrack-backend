/*
  Warnings:

  - You are about to alter the column `notiTime` on the `Configs` table. The data in that column could be lost. The data in that column will be cast from `Char(1)` to `SmallInt`.
  - You are about to alter the column `repeat` on the `Configs` table. The data in that column could be lost. The data in that column will be cast from `Char(1)` to `SmallInt`.

*/
-- AlterTable
ALTER TABLE `Configs` MODIFY `notiTime` SMALLINT NOT NULL DEFAULT 0,
    MODIFY `repeat` SMALLINT NOT NULL DEFAULT 0;
