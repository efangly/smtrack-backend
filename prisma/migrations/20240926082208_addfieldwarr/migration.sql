-- AlterTable
ALTER TABLE `Warranties` ADD COLUMN `customerAddress` VARCHAR(500) NULL,
    ADD COLUMN `customerName` VARCHAR(255) NULL,
    ADD COLUMN `installDate` VARCHAR(255) NULL,
    ADD COLUMN `productModel` VARCHAR(255) NULL,
    ADD COLUMN `productName` VARCHAR(255) NULL,
    ADD COLUMN `saleDept` VARCHAR(100) NULL;
