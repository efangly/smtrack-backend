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

const ZLogArray = z.array(ZLog);

export const ZLogType = ZLog.or(ZLogArray);

export type TQueryLog = z.infer<typeof ZQueryLog>;