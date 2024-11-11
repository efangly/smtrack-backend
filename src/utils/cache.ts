import { redisConn } from "../configs";
import { createLog } from "./logger";

export const checkCachedData = async (keyName: string): Promise<string | null> => {
  try {
    const cachedData = await redisConn.get(keyName);
    if (cachedData) {
      return cachedData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Redis client", error);
    createLog(`Redis: ${keyName}`, String(error));
    return null;
  }
}

export const setCacheData = async (keyName: string, time: number, data: string): Promise<void> => {
  try {
    await redisConn.setEx(keyName, time, data);
  } catch (error) {
    console.error("Redis client", error);
    createLog(`Redis: ${keyName}`, String(error));
  }
} 

export const removeCache = async (keyName: string): Promise<void> => {
  try {
    const dataSet = await redisConn.keys(`${keyName}*`);
    if (dataSet.length > 0) await redisConn.del(dataSet);
  } catch (error) {
    console.error("Redis client", error);
    createLog(`Redis: ${keyName}`, String(error));
  }
} 