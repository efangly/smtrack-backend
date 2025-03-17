import { z } from "zod";

export const ZLogParam = z.object({ logId: z.string() });
export const ZQueryLog = z.object({
  devSerial: z.string(),
  filter: z.string().optional(),
  type: z.string().optional()
});

const ZLog = z.object({
  devSerial: z.string(),
  tempValue: z.number().optional(),
  tempAvg: z.number().optional(),
  humidityValue: z.number().optional(),
  humidityAvg: z.number().optional(),
  sendTime: z.string().optional(),
  ac: z.string().optional(),
  door1: z.string().optional(),
  door2: z.string().optional(),
  door3: z.string().optional(),
  internet: z.string().optional(),
  probe: z.string().optional(),
  battery: z.number().optional(),
  ambient: z.number().optional(),
  sdCard: z.string().optional(),
});

const ZNewLog = z.object({
  serial: z.string(),
  temp: z.number().optional(),
  tempDisplay: z.number().optional(),
  humidity: z.number().optional(),
  humidityDisplay: z.number().optional(),
  sendTime: z.date().optional(),
  plug: z.boolean().optional(),
  door1: z.boolean().optional(),
  door2: z.boolean().optional(),
  door3: z.boolean().optional(),
  internet: z.boolean().optional(),
  probe: z.string().optional(),
  battery: z.number().optional(),
  tempInternal: z.number().optional(),
  extMemory: z.boolean().optional(),
});

const ZNewNotification = z.object({
  serial: z.string(),
  message: z.string(),
  detail: z.string(),
});

const ZLogArray = z.array(ZLog);

export const ZNewLogType = ZNewLog;
export const ZNewNotificationType = ZNewNotification;

export const ZLogType = ZLog.or(ZLogArray);

export type TLog = z.infer<typeof ZLogType>;
export type TNewLog = z.infer<typeof ZNewLogType>;
export type TNewNotification = z.infer<typeof ZNewNotificationType>;

export type TQueryLog = z.infer<typeof ZQueryLog>;