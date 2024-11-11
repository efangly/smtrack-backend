-- CreateTable
CREATE TABLE `Devices` (
    `devId` VARCHAR(100) NOT NULL,
    `wardId` VARCHAR(100) NOT NULL,
    `devSerial` VARCHAR(100) NOT NULL,
    `devName` VARCHAR(500) NOT NULL,
    `devDetail` VARCHAR(500) NULL,
    `devStatus` BOOLEAN NOT NULL DEFAULT false,
    `devSeq` SMALLINT NOT NULL,
    `devZone` VARCHAR(155) NULL,
    `locInstall` VARCHAR(250) NULL,
    `locPic` VARCHAR(200) NULL,
    `dateInstall` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `firmwareVersion` VARCHAR(55) NULL,
    `createBy` VARCHAR(100) NULL,
    `comment` VARCHAR(155) NULL,
    `backupStatus` CHAR(1) NULL DEFAULT '0',
    `moveStatus` VARCHAR(100) NULL,
    `alarm` BOOLEAN NOT NULL DEFAULT false,
    `duration` SMALLINT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Devices_devSerial_key`(`devSerial`),
    UNIQUE INDEX `Devices_devName_key`(`devName`),
    UNIQUE INDEX `Devices_devSeq_key`(`devSeq`),
    PRIMARY KEY (`devId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Probes` (
    `probeId` VARCHAR(100) NOT NULL,
    `probeName` VARCHAR(255) NOT NULL,
    `probeType` VARCHAR(20) NOT NULL,
    `probeCh` CHAR(1) NOT NULL,
    `tempMin` FLOAT NOT NULL DEFAULT 0.00,
    `tempMax` FLOAT NOT NULL DEFAULT 0.00,
    `humMin` FLOAT NOT NULL DEFAULT 0.00,
    `humMax` FLOAT NOT NULL DEFAULT 0.00,
    `adjustTemp` FLOAT NOT NULL DEFAULT 0.00,
    `adjustHum` FLOAT NOT NULL DEFAULT 0.00,
    `delayTime` VARCHAR(11) NULL,
    `door` SMALLINT NULL DEFAULT 0,
    `location` VARCHAR(250) NULL,
    `devSerial` VARCHAR(100) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`probeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Configs` (
    `confId` VARCHAR(100) NOT NULL,
    `mode` CHAR(1) NULL DEFAULT '0',
    `ip` VARCHAR(50) NULL,
    `macAddEth` VARCHAR(50) NULL,
    `macAddWiFi` VARCHAR(50) NULL,
    `subNet` VARCHAR(50) NULL,
    `getway` VARCHAR(50) NULL,
    `dns` VARCHAR(50) NULL,
    `ssid` VARCHAR(100) NULL,
    `ssidPass` VARCHAR(100) NULL,
    `sim` VARCHAR(100) NULL,
    `email1` VARCHAR(200) NULL,
    `email2` VARCHAR(200) NULL,
    `email3` VARCHAR(200) NULL,
    `notiTime` CHAR(1) NOT NULL DEFAULT '0',
    `backToNormal` CHAR(1) NOT NULL DEFAULT '0',
    `mobileNoti` CHAR(1) NOT NULL DEFAULT '1',
    `repeat` CHAR(1) NOT NULL DEFAULT '1',
    `devSerial` VARCHAR(100) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Configs_devSerial_key`(`devSerial`),
    PRIMARY KEY (`confId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hospitals` (
    `hosId` VARCHAR(100) NOT NULL,
    `hosName` VARCHAR(155) NOT NULL,
    `hosAddress` VARCHAR(155) NULL,
    `hosTelephone` VARCHAR(100) NULL,
    `userContact` VARCHAR(155) NULL,
    `userTelePhone` VARCHAR(100) NULL,
    `hosLatitude` VARCHAR(155) NULL,
    `hosLongitude` VARCHAR(155) NULL,
    `hosPic` VARCHAR(255) NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`hosId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wards` (
    `wardId` VARCHAR(100) NOT NULL,
    `wardName` VARCHAR(250) NOT NULL,
    `wardSeq` INTEGER NOT NULL,
    `hosId` VARCHAR(100) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Wards_wardSeq_key`(`wardSeq`),
    PRIMARY KEY (`wardId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `userId` VARCHAR(100) NOT NULL,
    `wardId` VARCHAR(100) NOT NULL,
    `userName` VARCHAR(155) NOT NULL,
    `userPassword` VARCHAR(155) NOT NULL,
    `userStatus` BOOLEAN NOT NULL DEFAULT true,
    `userLevel` CHAR(1) NOT NULL DEFAULT '4',
    `displayName` VARCHAR(150) NULL,
    `userPic` VARCHAR(255) NULL,
    `comment` VARCHAR(255) NULL,
    `createBy` VARCHAR(155) NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Users_userName_key`(`userName`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roles` (
    `roleId` CHAR(1) NOT NULL,
    `roleName` VARCHAR(500) NOT NULL,
    `rolePriority` CHAR(1) NOT NULL DEFAULT '4',
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notifications` (
    `notiId` VARCHAR(100) NOT NULL,
    `devSerial` VARCHAR(100) NOT NULL,
    `notiDetail` VARCHAR(255) NOT NULL,
    `notiStatus` BOOLEAN NOT NULL DEFAULT false,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`notiId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Repairs` (
    `repairId` VARCHAR(100) NOT NULL,
    `repairNo` SMALLINT NOT NULL AUTO_INCREMENT,
    `devId` VARCHAR(100) NOT NULL,
    `repairInfo` VARCHAR(155) NULL,
    `repairInfo1` VARCHAR(155) NULL,
    `repairInfo2` VARCHAR(155) NULL,
    `repairLocation` VARCHAR(155) NULL,
    `ward` VARCHAR(155) NULL,
    `repairDetails` VARCHAR(155) NULL,
    `telePhone` VARCHAR(11) NULL,
    `repairStatus` VARCHAR(155) NULL,
    `warrantyStatus` CHAR(1) NULL,
    `comment` VARCHAR(155) NULL,
    `baseStatus` CHAR(1) NULL DEFAULT '0',
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Repairs_repairNo_key`(`repairNo`),
    PRIMARY KEY (`repairId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Warranties` (
    `warrId` VARCHAR(100) NOT NULL,
    `devName` VARCHAR(100) NOT NULL,
    `invoice` VARCHAR(50) NULL,
    `expire` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `warrStatus` BOOLEAN NOT NULL DEFAULT false,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`warrId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LogDays` (
    `logId` VARCHAR(100) NOT NULL,
    `devSerial` VARCHAR(100) NOT NULL,
    `tempValue` FLOAT NOT NULL DEFAULT 0.00,
    `tempAvg` FLOAT NOT NULL DEFAULT 0.00,
    `humidityValue` FLOAT NOT NULL DEFAULT 0.00,
    `humidityAvg` FLOAT NOT NULL DEFAULT 0.00,
    `sendTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ac` CHAR(1) NOT NULL DEFAULT '0',
    `door1` CHAR(1) NOT NULL DEFAULT '0',
    `door2` CHAR(1) NOT NULL DEFAULT '0',
    `door3` CHAR(1) NOT NULL DEFAULT '0',
    `internet` CHAR(1) NOT NULL DEFAULT '0',
    `probe` VARCHAR(10) NOT NULL DEFAULT '1',
    `battery` SMALLINT NOT NULL DEFAULT 0,
    `ambient` FLOAT NULL DEFAULT 0.00,
    `sdCard` CHAR(1) NOT NULL DEFAULT '0',
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`logId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LogDaysBackup` (
    `logId` VARCHAR(100) NOT NULL,
    `devSerial` VARCHAR(100) NOT NULL,
    `tempValue` FLOAT NOT NULL DEFAULT 0.00,
    `tempAvg` FLOAT NOT NULL DEFAULT 0.00,
    `humidityValue` FLOAT NOT NULL DEFAULT 0.00,
    `humidityAvg` FLOAT NOT NULL DEFAULT 0.00,
    `sendTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ac` CHAR(1) NOT NULL DEFAULT '0',
    `door1` CHAR(1) NOT NULL DEFAULT '0',
    `door2` CHAR(1) NOT NULL DEFAULT '0',
    `door3` CHAR(1) NOT NULL DEFAULT '0',
    `internet` CHAR(1) NOT NULL DEFAULT '0',
    `probe` VARCHAR(10) NOT NULL DEFAULT '1',
    `battery` SMALLINT NOT NULL DEFAULT 0,
    `ambient` FLOAT NULL DEFAULT 0.00,
    `sdCard` CHAR(1) NOT NULL DEFAULT '0',
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`logId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Devices` ADD CONSTRAINT `Devices_wardId_fkey` FOREIGN KEY (`wardId`) REFERENCES `Wards`(`wardId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Probes` ADD CONSTRAINT `Probes_devSerial_fkey` FOREIGN KEY (`devSerial`) REFERENCES `Devices`(`devSerial`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Configs` ADD CONSTRAINT `Configs_devSerial_fkey` FOREIGN KEY (`devSerial`) REFERENCES `Devices`(`devSerial`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wards` ADD CONSTRAINT `Wards_hosId_fkey` FOREIGN KEY (`hosId`) REFERENCES `Hospitals`(`hosId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_wardId_fkey` FOREIGN KEY (`wardId`) REFERENCES `Wards`(`wardId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_userLevel_fkey` FOREIGN KEY (`userLevel`) REFERENCES `Roles`(`roleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_devSerial_fkey` FOREIGN KEY (`devSerial`) REFERENCES `Devices`(`devSerial`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Repairs` ADD CONSTRAINT `Repairs_devId_fkey` FOREIGN KEY (`devId`) REFERENCES `Devices`(`devId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Warranties` ADD CONSTRAINT `Warranties_devName_fkey` FOREIGN KEY (`devName`) REFERENCES `Devices`(`devName`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogDays` ADD CONSTRAINT `LogDays_devSerial_fkey` FOREIGN KEY (`devSerial`) REFERENCES `Devices`(`devSerial`) ON DELETE RESTRICT ON UPDATE CASCADE;
