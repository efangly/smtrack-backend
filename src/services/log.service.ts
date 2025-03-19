import { prisma, redisConn } from "../configs";
import { v4 as uuidv4 } from 'uuid';
import { LogDays, Prisma } from "@prisma/client";
import { getDateFormat, getDateFullYear, getDistanceTime, removeCache, setCacheData, splitLog } from "../utils";
import { ResToken, TQueryLog } from "../models";
import { NotFoundError, ValidationError } from "../error";
import { backupNoti } from "./notification.service";
import { format } from "date-fns";
import { sendNewQueue } from "./queue.service";

const logCondition = (condition: Prisma.LogDaysWhereInput) => {
  return {
    where: condition,
    include: { device: { include: { probe: true } } },
    orderBy: { sendTime: 'asc' }
  } as Prisma.LogDaysFindManyArgs
};

const logBackupCondition = (condition: Prisma.LogDaysBackupWhereInput) => {
  return {
    where: condition,
    include: { device: { include: { probe: true } } },
    orderBy: { sendTime: 'asc' }
  } as Prisma.LogDaysBackupFindManyArgs
};

const logList = async (query: TQueryLog, token: ResToken): Promise<LogDays[]> => {
  try {
    let keyName = "";
    let condition: Prisma.LogDaysWhereInput | Prisma.LogDaysBackupWhereInput | undefined = undefined;
    switch (token.userLevel) {
      case "4":
        condition = { device: { wardId: token.wardId } };
        keyName = `log:${token.wardId}`;
        break;
      case "3":
        condition = { device: { wardId: token.wardId } };
        keyName = `log:${token.wardId}`;
        break;
      case "2":
        condition = { device: { ward: { hosId: token.hosId } } }
        keyName = `log:${token.hosId}`;
        break;
      case "1":
        condition = { NOT: { device: { wardId: "WID-DEVELOPMENT" } } }
        keyName = "log:WID-DEVELOPMENT";
        break;
      default:
        condition = undefined;
        keyName = "log";
    }
    if (query.devSerial && query.filter) {
      switch (query.filter) {
        case "day":
          const dayResult = await prisma.logDays.findMany(
            logCondition({
              devSerial: query.devSerial,
              sendTime: { gte: getDistanceTime('day') },
              ...condition as Prisma.LogDaysWhereInput
            })
          );
          // set cache
          await setCacheData(keyName + "day", 300, JSON.stringify(dayResult));
          return dayResult;
        case "week":
          const [week, weekBackup] = await prisma.$transaction([
            prisma.logDays.findMany(
              logCondition({
                devSerial: query.devSerial,
                sendTime: { gte: getDistanceTime('week') },
                ...condition as Prisma.LogDaysWhereInput
              })
            ),
            prisma.logDaysBackup.findMany(
              logBackupCondition({
                devSerial: query.devSerial,
                sendTime: { gte: getDistanceTime('week') },
                ...condition as Prisma.LogDaysBackupWhereInput
              })
            )
          ]);
          const weekResult = query.type ? weekBackup.concat(week) : splitLog(weekBackup.concat(week), 2);
          // set cache
          await setCacheData(keyName + "week", 300, JSON.stringify(weekResult));
          return weekResult
        case "month":
          const [month, monthBackup] = await prisma.$transaction([
            prisma.logDays.findMany(
              logCondition({
                devSerial: query.devSerial,
                sendTime: { gte: getDistanceTime('month') },
                ...condition as Prisma.LogDaysWhereInput
              })
            ),
            prisma.logDaysBackup.findMany(
              logBackupCondition({
                devSerial: query.devSerial,
                sendTime: { gte: getDistanceTime('month') },
                ...condition as Prisma.LogDaysBackupWhereInput
              })
            )
          ]);
          const monthResult = query.type ? monthBackup.concat(month) : splitLog(monthBackup.concat(month), 4);
          // set cache
          await setCacheData(keyName + "month", 300, JSON.stringify(monthResult));
          return monthResult;
        default:
          const startDate = getDateFormat(new Date(query.filter.split(",")[0]));
          const endDate = getDateFormat(new Date(query.filter.split(",")[1]));
          let diffDays = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
          const [logday, logdayBackup] = await prisma.$transaction([
            prisma.logDays.findMany(
              logCondition({
                devSerial: query.devSerial,
                sendTime: { gte: startDate, lte: endDate },
                ...condition as Prisma.LogDaysWhereInput
              })
            ),
            prisma.logDaysBackup.findMany(
              logBackupCondition({
                devSerial: query.devSerial,
                sendTime: { gte: startDate, lte: endDate },
                ...condition as Prisma.LogDaysBackupWhereInput
              })
            )
          ]);
          const splitTime = diffDays <= 7 ? 2 : diffDays > 7 && diffDays <= 20 ? 3 : 4; // optimize data for graph
          const value = diffDays == 1 ? logdayBackup.concat(logday) : splitLog(logdayBackup.concat(logday), splitTime);
          const result = query.type ? logdayBackup.concat(logday) : value;
          const keyDate = `${format(startDate, "yyyyMMdd")}${format(endDate, "yyyyMMdd")}`;
          await setCacheData(`${keyName}${keyDate}`, 300, JSON.stringify(result));
          return result;
      }
    } else {
      return await prisma.logDays.findMany(
        logCondition({
          devSerial: query.devSerial,
          ...condition as Prisma.LogDaysWhereInput
        })
      );
    }
  } catch (error) {
    throw error;
  }
}

const findLog = async (logId: string): Promise<LogDays> => {
  try {
    const result = await prisma.logDays.findUnique({
      where: { logId: logId }
    })
    if (!result) throw new NotFoundError(`Log not found for : ${logId}`);
    return result;
  } catch (error) {
    throw error;
  }
}

const addLog = async (body: LogDays | LogDays[]) => {
  try {
    const currentYear = format(new Date(), "yyyy");
    if (Array.isArray(body)) {
      let logArr: LogDays[] = [];
      body.forEach((log) => {
        const sendTimeYear = getDateFullYear(log.sendTime);
        if (sendTimeYear) {
          if (log.tempValue !== 0 && log.humidityValue !== 0 && sendTimeYear === currentYear) {
            logArr.push({
              logId: `LOG-${uuidv4()}`,
              devSerial: log.devSerial,
              tempValue: log.tempValue,
              tempAvg: log.tempAvg,
              humidityValue: log.humidityValue,
              humidityAvg: log.humidityAvg,
              sendTime: getDateFormat(log.sendTime),
              ac: log.ac,
              door1: log.door1,
              door2: log.door2,
              door3: log.door3,
              internet: log.internet,
              probe: log.probe,
              battery: log.battery,
              ambient: log.ambient,
              sdCard: log.sdCard,
              createAt: getDateFormat(new Date()),
              updateAt: getDateFormat(new Date()),
            });
            sendNewQueue({
              serial: log.devSerial,
              temp: log.tempValue,
              tempDisplay: log.tempAvg,
              humidity: log.humidityValue,
              humidityDisplay: log.humidityAvg,
              sendTime: log.sendTime,
              plug: log.ac === "0" ? true : false,
              door1: log.door1 === "0" ? true : false,
              door2: log.door2 === "0" ? true : false,
              door3: log.door3 === "0" ? true : false,
              internet: log.internet === "0" ? true : false,
              probe: log.probe,
              battery: log.battery,
              tempInternal: log.ambient || 0,
              extMemory: log.sdCard === "0" ? true : false
            });
          }
        }
      });
      removeCache("log");
      removeCache("device");
      backupLog();
      return logArr.length > 0 ? await prisma.logDays.createMany({ data: logArr }) : [];
    } else {
      const sendTimeYear = getDateFullYear(body.sendTime); 
      if (sendTimeYear === undefined) throw new ValidationError(`${body.devSerial}: Sendtime is invalid, ${body.sendTime}`);
      if (body.tempValue !== 0 && body.humidityValue !== 0 && sendTimeYear === currentYear) {
        body.logId = `LOG-${uuidv4()}`;
        body.createAt = getDateFormat(new Date());
        body.updateAt = getDateFormat(new Date());
        sendNewQueue({
          serial: body.devSerial,
          temp: body.tempValue,
          tempDisplay: body.tempAvg,
          humidity: body.humidityValue,
          humidityDisplay: body.humidityAvg,
          sendTime: body.sendTime,
          plug: body.ac === "0" ? true : false,
          door1: body.door1 === "0" ? true : false,
          door2: body.door2 === "0" ? true : false,
          door3: body.door3 === "0" ? true : false,
          internet: body.internet === "0" ? true : false,
          probe: body.probe,
          battery: body.battery,
          tempInternal: body.ambient || 0,
          extMemory: body.sdCard === "0" ? true : false
        });
        body.sendTime = getDateFormat(body.sendTime);
        removeCache("log");
        removeCache("device");
        return await prisma.logDays.create({ data: body });
      } else {
        if (sendTimeYear === currentYear) {
          if (body.tempValue === 0 && body.humidityValue === 0) {
            throw new ValidationError(`${body.devSerial}: Temp and Humi value must be greater than 0`);
          } else {
            throw new ValidationError(`${body.devSerial}: Temp ${body.tempValue.toString()} Humi ${body.humidityValue.toString()}`);
          }
        } else {
          throw new ValidationError(`${body.devSerial}: Expected years ${currentYear}. received ${sendTimeYear}`);
        }
      }
    }
  } catch (error) {
    throw error;
  }
};

const removeLog = async (serialNumber: string) => {
  try {
    await prisma.$transaction([
      prisma.logDaysBackup.deleteMany({
        where: { devSerial: serialNumber }
      }),
      prisma.logDays.deleteMany({
        where: { devSerial: serialNumber }
      }),
      prisma.notifications.deleteMany({
        where: { devSerial: serialNumber }
      }),
      prisma.notificationsBackup.deleteMany({
        where: { devSerial: serialNumber }
      })
    ]);
    return "Delete log success";
  } catch (error) {
    throw error;
  }
}

const backupLog = async (): Promise<string> => {
  try {
    let responseMessage = "";
    const backupList = await prisma.logDays.findMany({
      where: {
        sendTime: { lt: getDistanceTime('day') }
      },
      orderBy: { createAt: 'asc' }
    });
    if (backupList.length > 0) {
      await prisma.logDaysBackup.createMany({
        data: backupList
      });
      await prisma.logDays.deleteMany({
        where: { sendTime: { lt: getDistanceTime('day') } }
      });
      responseMessage = "Backup log success";
    } else {
      responseMessage = "No log data for log backup";
    }
    await redisConn.flushAll();
    return `${responseMessage} && ${await backupNoti()}`;
  } catch (error) {
    throw error;
  }
}

export {
  logList,
  findLog,
  addLog,
  removeLog,
  backupLog
};