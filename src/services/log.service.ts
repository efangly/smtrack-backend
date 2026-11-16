import { v4 as uuidv4 } from 'uuid';
import { LogDays } from "@prisma/client";
import { getDateFormat, getDateFullYear } from "../utils";
import { ValidationError } from "../error";
import { format } from "date-fns";
import { sendNewQueue } from "./queue.service";

const addLog = async (body: LogDays | LogDays[]) => {
  try {
    const currentYear = format(new Date(), "yyyy");
    if (Array.isArray(body)) {
      body.forEach((log) => {
        const sendTimeYear = getDateFullYear(log.sendTime);
        if (sendTimeYear) {
          if (log.tempValue !== 0 && log.humidityValue !== 0 && sendTimeYear === currentYear) {
            sendNewQueue({
              serial: log.devSerial,
              temp: log.tempValue,
              tempDisplay: log.tempAvg,
              humidity: log.humidityValue,
              humidityDisplay: log.humidityAvg,
              sendTime: log.sendTime,
              plug: log.ac === "0" ? true : false,
              door1: log.door1 === "1" ? true : false,
              door2: log.door2 === "1" ? true : false,
              door3: log.door3 === "1" ? true : false,
              internet: log.internet === "0" ? true : false,
              probe: log.probe,
              battery: log.battery,
              tempInternal: log.ambient || 0,
              extMemory: log.sdCard === "0" ? true : false
            });
          }
        }
      });
      return body.length
    } else {
      const sendTimeYear = getDateFullYear(body.sendTime);
      if (sendTimeYear === undefined) throw new ValidationError(`${body.devSerial}: Sendtime is invalid, ${body.sendTime}`);
      if (body.tempValue !== 0 && body.humidityValue !== 0 && sendTimeYear === currentYear) {
        body.logId = `LOG-${uuidv4()}`;
        body.createAt = getDateFormat(new Date());
        body.updateAt = getDateFormat(new Date());
        await sendNewQueue({
          serial: body.devSerial,
          temp: body.tempValue,
          tempDisplay: body.tempAvg,
          humidity: body.humidityValue,
          humidityDisplay: body.humidityAvg,
          sendTime: body.sendTime,
          plug: body.ac === "0" ? true : false,
          door1: body.door1 === "1" ? true : false,
          door2: body.door2 === "1" ? true : false,
          door3: body.door3 === "1" ? true : false,
          internet: body.internet === "0" ? true : false,
          probe: body.probe,
          battery: body.battery,
          tempInternal: body.ambient || 0,
          extMemory: body.sdCard === "0" ? true : false
        });
        body.sendTime = getDateFormat(body.sendTime);
        return body;
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
    console.log(error);
    return error;
  }
};

export {
  addLog
};
