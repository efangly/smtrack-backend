-- CreateTable
CREATE TABLE `NotificationsBackup` (
    `notiId` VARCHAR(100) NOT NULL,
    `devSerial` VARCHAR(100) NOT NULL,
    `notiDetail` VARCHAR(255) NOT NULL,
    `notiStatus` BOOLEAN NOT NULL DEFAULT false,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`notiId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `NotificationsBackup` ADD CONSTRAINT `NotificationsBackup_devSerial_fkey` FOREIGN KEY (`devSerial`) REFERENCES `Devices`(`devSerial`) ON DELETE RESTRICT ON UPDATE CASCADE;
