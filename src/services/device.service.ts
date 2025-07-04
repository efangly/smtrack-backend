import fs from "node:fs"
import path from "node:path";
import { prisma } from "../configs";
import { v4 as uuidv4 } from 'uuid';
import { getDeviceImage, getDateFormat, getDistanceTime, objToString, checkCachedData, setCacheData, removeCache, splitLog } from "../utils";
import { Configs, Devices, LogDays, Prisma } from "@prisma/client";
import { NotFoundError } from "../error";
import { ResToken, TAdjustConfig, TDevice, TNewConfig, TNewDevice, TNewProbe, TQueryDevice } from "../models";
import { addHistory } from "./history.service";
import { format } from "date-fns";
import { sendToDeviceQueue } from "./queue.service";

const deviceList = async (): Promise<Devices[]> => {
  try {
    const result = await prisma.devices.findMany({
      include: { 
        config: true,
        log: { take: 1, orderBy: [{ sendTime: 'desc' }, { createAt: 'desc' }] }
      },
      orderBy: { devSeq: "asc"}
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const deviceWithLog = async (token?: ResToken): Promise<Devices[]> => {
  try {
    let { conditions, keyName } = setCondition(token);
    const cache = await checkCachedData(keyName);
    if (cache) return JSON.parse(cache);
    const result = await prisma.devices.findMany({
      where: conditions,
      include: {
        log: { take: 1, orderBy: [{ sendTime: 'desc' }, { createAt: 'desc' }] },
        probe: true,
        config: true,
        noti: { orderBy: { createAt: 'desc' } },
        ward: { select: { wardName: true, hospital: { select: { hosId: true, hosName: true } } } },
        warranty: { take: 1, select: { expire: true }, orderBy: { createAt: 'desc' } },
        _count: {
          select: {
            warranty: { where: { warrStatus: false } },
            repair: true,
            history: { where: { createAt: { gte: getDistanceTime('day') } } },
            log: { where: { internet: "1" } },
            noti: { where: { notiDetail: "INTERNET/ON" } }
          }
        }
      },
      orderBy: { devSeq: "asc" }
    });
    // set cache
    await setCacheData(keyName, 3600, JSON.stringify(result));
    return result;
  } catch (error) {
    throw error;
  }
}

const deviceById = async (deviceId: string): Promise<Devices | null> => {
  try {
    const devId = await prisma.devices.findUnique({ 
      where: { devId: deviceId },
      include: {
        ward: { include: { hospital: { select: { hosName: true } } } },
        log: { orderBy: { sendTime: 'desc' } },
        probe: { orderBy: { probeCh: 'asc' } },
        warranty: { take: 1, select: { expire: true }, orderBy: { createAt: 'desc' } },
        config: true
      }
    });
    const devSerial = await prisma.devices.findUnique({ 
      where: { devSerial: deviceId },
      include: {
        ward: { include: { hospital: { select: { hosName: true } } } },
        log: { orderBy: { sendTime: 'desc' } },
        probe: { orderBy: { probeCh: 'asc' } },
        warranty: { take: 1, select: { expire: true }, orderBy: { createAt: 'desc' } },
        config: true
      }
    });
    if (!devId && !devSerial) throw new NotFoundError(`Device not found for : ${deviceId}`);
    if (devId) {
      return devId;
    } else {
      return devSerial;
    }
  } catch (error) {
    throw error;
  }
};

const addDevice = async (body: TDevice, pic?: Express.Multer.File): Promise<Devices> => {
  try {
    const seq: Devices[] = await deviceList();
    const result = await prisma.devices.create({
      data: {
        devId: `DEV-${uuidv4()}`,
        devName: `DEVICE-${uuidv4()}`,
        devSerial: String(body.devSerial),
        wardId: !body.wardId ? "WID-DEVELOPMENT" : body.wardId,
        locPic: pic ? `/img/device/${pic.filename}` : null,
        devSeq: seq.length === 0 ? 1 : seq[seq.length - 1].devSeq + 1,
        createAt: getDateFormat(new Date()),
        updateAt: getDateFormat(new Date()),
        config: {
          create: {
            confId: `CONF-${uuidv4()}`,
            macAddWiFi: body.config?.macAddWiFi,
            ssid: "RDE2_2.4GHz",
            ssidPass: "rde05012566",
            createAt: getDateFormat(new Date()),
            updateAt: getDateFormat(new Date())
          }
        },
        probe: {
          create: {
            probeId: `PID-${uuidv4()}`,
            probeName: "SHT-31",
            probeType: "SHT-31",
            probeCh: "1",
            delayTime: "5",
            door: 1,
            tempMax: 35,
            humMax: 100,
            createAt: getDateFormat(new Date()),
            updateAt: getDateFormat(new Date())
          }
        }
      }
    });
    removeCache("device");
    return result;
  } catch (error) {
    throw error;
  }
};

const editDevice = async (deviceId: string, body: Devices, token: ResToken, pic?: Express.Multer.File): Promise<Devices> => {
  try {
    const filename = await getDeviceImage(deviceId);
    const detail = objToString(body);
    if (body.dateInstall) body.dateInstall = getDateFormat(body.dateInstall);
    if (body.devSeq) body.devSeq = Number(body.devSeq);
    if (body.devStatus) body.devStatus = String(body.devStatus) == "1" ? true : false;
    body.updateAt = getDateFormat(new Date());
    body.locPic = pic ? `/img/device/${pic.filename}` : filename || null;
    const result: Devices = await prisma.devices.update({
      where: { devId: deviceId },
      data: body
    });
    if (pic && !!filename) fs.unlinkSync(path.join('public/images/device', filename.split("/")[3]));
    await addHistory(`Device: [${detail}]`, result.devSerial, token.userId);
    removeCache("device");
    return result;
  } catch (error) {
    throw error;
  }
};

const updateFirmware = async (devSerial: string, body: Devices) => {
  try {
    const result = await prisma.devices.update({
      where: { devSerial: devSerial },
      data: body
    });
    removeCache("device");
    sendToDeviceQueue<{ id: string, device: TNewDevice }>('update-device', {
      id: result.devSerial,
      device: { firmware: result.firmwareVersion ?? "1.0.0" }
    });
    return result;
  } catch (error) {
    throw error;
  }
}

const removeDevice = async (deviceId: string): Promise<Devices> => {
  try {
    const filename = await getDeviceImage(deviceId);
    const result = await prisma.devices.delete({ where: { devId: deviceId } });
    if (!!filename) fs.unlinkSync(path.join('public/images/device', filename.split("/")[3]));
    removeCache("device");
    return result;
  } catch (error) {
    throw error;
  }
};

const editSequence = async (beforeId: string, beforeSeq: number, afterId: string, afterSeq: number) => {
  try {
    await prisma.$transaction([
      prisma.devices.update({
        where: { devId: afterId },
        data: { devSeq: Math.floor(Math.random() * (32000 - 31000)) + 31000 }
      }),
      prisma.devices.update({
        where: { devId: beforeId },
        data: { devSeq: afterSeq }
      }),
      prisma.devices.update({
        where: { devId: afterId },
        data: { devSeq: beforeSeq }
      }),
    ]);
    removeCache("device");
    return true;
  } catch (error) {
    throw error;
  }
}

const findConfig = async (): Promise<Configs[]> => {
  try {
    const cache = await checkCachedData("config");
    if (cache) return JSON.parse(cache);
    const result = await prisma.configs.findMany();
    // set cache
    await setCacheData("config", 3600 * 24, JSON.stringify(result));
    return result;
  } catch (error) {
    throw error;
  }
}

const findConfigById = async (deviceId: string): Promise<Devices | null> => {
  try {
    const result = await prisma.devices.findUnique({
      where: { devSerial: deviceId },
      select: {
        devSerial: true,
        devDetail: true,
        devStatus: true,
        config: true,
        probe: true
      }
    });
    return result as unknown as Devices;
  } catch (error) {
    throw error;
  }
};

const editConfig = async (deviceId: string, body: Configs, token: ResToken): Promise<Configs> => {
  try {
    const detail = objToString(body);
    body.updateAt = getDateFormat(new Date());
    const result = await prisma.configs.update({
      where: { devSerial: deviceId },
      data: body,
      include: {
        device: { include: { probe: true } }
      }
    });
    await addHistory(`Config: [${detail}]`, result.devSerial, token.userId);
    sendToDeviceQueue<{id: String, config:TNewConfig}>('update-config', {
      id: result.devSerial,
      config: {
        dhcp: result.mode === "1" ? true : false,
        ip: result.ip ?? undefined,
        mac: result.macAddWiFi ?? undefined,
        subnet: result.subNet ?? undefined,
        gateway: result.getway ?? undefined,
        dns: result.dns ?? undefined,
        dhcpEth: result.modeEth === "1" ? true : false,
        ipEth: result.ipEth ?? undefined,
        macEth: result.macAddEth ?? undefined,
        subnetEth: result.subNetEth ?? undefined,
        gatewayEth: result.getwayEth ?? undefined,
        dnsEth: result.dnsEth ?? undefined,
        ssid: result.ssid ?? "RDE3_2.4GHz",
        password: result.ssidPass ?? "rde05012566",
        simSP: result.sim ?? undefined,
        email1: result.email1 ?? undefined,
        email2: result.email2 ?? undefined,
        email3: result.email3 ?? undefined,
        hardReset: result.hardReset ?? "0200",
      }
    });
    sendToDeviceQueue<{id: String, probe: TNewProbe}>('update-probe', {
      id: result.devSerial,
      probe: {
        name: result.device.probe[0].probeName,
        type: result.device.probe[0].probeType,
        channel: result.device.probe[0].probeCh,
        tempMin: result.device.probe[0].tempMin,
        tempMax: result.device.probe[0].tempMax,
        humiMin: result.device.probe[0].humMin,
        humiMax: result.device.probe[0].humMax,
        tempAdj: result.device.probe[0].adjustTemp,
        humiAdj: result.device.probe[0].adjustHum,
        firstDay: result.firstDay ?? "OFF",
        secondDay: result.secondDay ?? "OFF",
        thirdDay: result.thirdDay ?? "OFF",
        firstTime: result.firstTime ?? "OFF",
        secondTime: result.secondTime ?? "OFF",
        thirdTime: result.thirdTime ?? "OFF",
        doorQty: result.device.probe[0].door ?? 1,
        position: result.device.probe[0].location,
      }
    });
    removeCache("device");
    removeCache("config");
    return result;
  } catch (error) {
    throw error;
  }
};

const editDeviceConfig = async (deviceId: string, body: TAdjustConfig): Promise<Devices> => {
  try {
    const result = await prisma.devices.update({
      where: { devSerial: deviceId },
      select: { 
        devSerial: true, 
        devDetail: true,
        config: true, 
        probe: true 
      },
      data: { 
        devDetail: body.devDetail ? body.devDetail : undefined,
        config: { 
          update: body.config ? body.config as unknown as Configs : undefined
        }, 
        probe: { 
          updateMany: body.probe ? {
            where: { devSerial: deviceId, probeCh: body.probe.probeCh },
            data: body.probe
          } : undefined
        },
        ward: { 
          update: body.ward ? {
            where: { wardId: body.ward.wardId },
            data: body.ward
          } : undefined
        }
      },
    });
    sendToDeviceQueue<{id: String, config:TNewConfig}>('update-config', {
      id: result.devSerial,
      config: {
        dhcp: result.config?.mode === "1" ? true : false,
        ip: result.config?.ip ?? undefined,
        mac: result.config?.macAddWiFi ?? undefined,
        subnet: result.config?.subNet ?? undefined,
        gateway: result.config?.getway ?? undefined,
        dns: result.config?.dns ?? undefined,
        dhcpEth: result.config?.modeEth === "1" ? true : false,
        ipEth: result.config?.ipEth ?? undefined,
        macEth: result.config?.macAddEth ?? undefined,
        subnetEth: result.config?.subNetEth ?? undefined,
        gatewayEth: result.config?.getwayEth ?? undefined,
        dnsEth: result.config?.dnsEth ?? undefined,
        ssid: result.config?.ssid ?? "RDE3_2.4GHz",
        password: result.config?.ssidPass ?? "rde05012566",
        simSP: result.config?.sim ?? undefined,
        email1: result.config?.email1 ?? undefined,
        email2: result.config?.email2 ?? undefined,
        email3: result.config?.email3 ?? undefined,
        hardReset: result.config?.hardReset ?? "0200",
      }
    });
    sendToDeviceQueue<{id: String, probe: TNewProbe}>('update-probe', {
      id: result.devSerial,
      probe: {
        name: result.probe[0].probeName,
        type: result.probe[0].probeType,
        channel: result.probe[0].probeCh,
        tempMin: result.probe[0].tempMin,
        tempMax: result.probe[0].tempMax,
        humiMin: result.probe[0].humMin,
        humiMax: result.probe[0].humMax,
        tempAdj: result.probe[0].adjustTemp,
        humiAdj: result.probe[0].adjustHum,
        firstDay: result.config?.firstDay ?? "OFF",
        secondDay: result.config?.secondDay ?? "OFF",
        thirdDay: result.config?.thirdDay ?? "OFF",
        firstTime: result.config?.firstTime ?? "OFF",
        secondTime: result.config?.secondTime ?? "OFF",
        thirdTime: result.config?.thirdTime ?? "OFF",
        doorQty: result.probe[0].door ?? 1,
        position: result.probe[0].location,
      }
    });
    removeCache("hospital");
    removeCache("ward");
    removeCache("device");
    removeCache("config");
    return result as unknown as Devices;
  } catch (error) {
    throw error;
  }
};

const compareDevice = async (query: TQueryDevice, token: ResToken) => {
  try {
    let { conditions, keyName } = setCondition(token);
    let logCondition: Prisma.LogDaysWhereInput | undefined = undefined;
    let diffDays = 0;
    if (query.start && query.end) {
      const startDate = getDateFormat(new Date(query.start));
      const endDate = getDateFormat(new Date(query.end));
      logCondition = { 
        sendTime: { 
          gte: startDate, 
          lte: endDate
        } 
      }
      diffDays = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
      keyName = keyName + `${format(startDate, "yyyyMMdd")}${format(endDate, "yyyyMMdd")}`;
    } else {
      logCondition = { 
        sendTime: { 
          gte: getDistanceTime('month')
        } 
      }
      keyName = keyName + "month";
    }
    const cache = await checkCachedData(keyName);
    if (cache) return JSON.parse(cache);
    const result = await prisma.devices.findMany({
      select: { 
        devSerial: true, 
        devDetail: true,
        ward: { include: { hospital: true } },
        log: { 
          where: logCondition,
          orderBy: { sendTime: 'asc' } 
        },
        logBak: {
          where: logCondition as Prisma.LogDaysBackupWhereInput,
          orderBy: { sendTime: 'asc' } 
        } 
      },
      where: conditions,
      orderBy: { devSeq: "asc" }
    });
    const log = result.map((item) => {
      return {
        devSerial: item.devSerial,
        devDetail: item.devDetail,
        wardId: item.ward.wardId,
        wardName: item.ward.wardName,
        hosName: item.ward.hospital.hosName,
        log: setSplitCondition(result.length, diffDays, item.logBak.concat(item.log))
      };
    });
    // set cache
    await setCacheData(keyName, 3600, JSON.stringify(log));
    return log;
  } catch (error) {
    throw error;
  }
}

const setCondition = (token?: ResToken) => {
  let conditions: Prisma.DevicesWhereInput | undefined = undefined;
  let keyName = "";
  switch (token?.userLevel) {
    case "3":
      conditions = { wardId: token.wardId };
      keyName = `device:${token.wardId}`;
      break;
    case "2":
      conditions = { ward: { hosId: token.hosId } };
      keyName = `device:${token.hosId}`;
      break;
    case "1":
      conditions = { NOT: { ward: { hosId: "HID-DEVELOPMENT" } } };
      keyName = "device:HID-DEVELOPMENT";
      break;
    default:
      conditions = undefined;
      keyName = "device";
  }
  return { conditions, keyName };
}

const setSplitCondition = (device: number, diff: number, data: LogDays[]) => {
  if (diff === 0) {
    if (device < 5) {
      return splitLog(data, 6);
    } else if (device >= 5 && device < 10) {
      return splitLog(data, 7);
    } else {
      return splitLog(data, 8);
    }
  } else if (diff < 7) {
    if (device < 5) {
      return splitLog(data, 2);
    } else if (device >= 5 && device < 10) {
      return splitLog(data, 3);
    } else {
      return splitLog(data, 4);
    }
  } else if (diff >= 7 && diff < 21) {
    if (device < 5) {
      return splitLog(data, 3);
    } else if (device >= 5 && device < 10) {
      return splitLog(data, 4);
    } else {
      return splitLog(data, 5);
    }
  } else {
    if (device < 5) {
      return splitLog(data, 6);
    } else if (device >= 5 && device < 10) {
      return splitLog(data, 7);
    } else {
      return splitLog(data, 8);
    }
  }
}

export {
  deviceList,
  deviceWithLog,
  deviceById,
  addDevice,
  editDevice,
  removeDevice,
  findConfig,
  findConfigById,
  editConfig,
  editSequence,
  compareDevice,
  updateFirmware,
  editDeviceConfig
};