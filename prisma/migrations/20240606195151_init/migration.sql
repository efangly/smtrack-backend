-- CreateTable
CREATE TABLE `ConfigHistory` (
    `id` VARCHAR(100) NOT NULL,
    `devSerial` VARCHAR(100) NOT NULL,
    `detail` VARCHAR(500) NOT NULL,
    `userName` VARCHAR(155) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LogDaysBackup` ADD CONSTRAINT `LogDaysBackup_devSerial_fkey` FOREIGN KEY (`devSerial`) REFERENCES `Devices`(`devSerial`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConfigHistory` ADD CONSTRAINT `ConfigHistory_devSerial_fkey` FOREIGN KEY (`devSerial`) REFERENCES `Devices`(`devSerial`) ON DELETE RESTRICT ON UPDATE CASCADE;
