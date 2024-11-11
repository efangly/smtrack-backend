import { ConfigHistory, Prisma } from "@prisma/client";
import { prisma } from "../configs";
import { ResToken } from "../models";
import { checkCachedData, getDateFormat, removeCache, setCacheData } from "../utils";
import { v4 as uuidv4 } from 'uuid';

const historyList = async (token: ResToken): Promise<ConfigHistory[]> => {
  try {
    let conditions: Prisma.ConfigHistoryWhereInput | undefined = undefined;
    let keyName: string = "";
    switch (token?.userLevel) {
      case "3":
        conditions = { device: { wardId: token.wardId } };
        keyName = `history:${token.wardId}`;
        break;
      case "2":
        conditions = { device: { ward: { hosId: token.hosId } } };
        keyName = `history:${token.hosId}`;
        break;
      default:
        conditions = undefined;
        keyName = "history";
    }
    // get cache
    const cache = await checkCachedData(keyName);
    if (cache) return JSON.parse(cache);
    const result = await prisma.configHistory.findMany({
      where: conditions,
      select: {
        detail: true,
        devSerial: true,
        userId: true,
        createAt: true
      },
      orderBy: { createAt: 'desc' }
    });
    // set cache
    await setCacheData(keyName, 3600, JSON.stringify(result));
    return result as unknown as ConfigHistory[];
  } catch (error) {
    throw error;
  }
}

const addHistory = async (detail: string, serial: string, userId: string) => {
  try {
    const result = prisma.configHistory.create({
      data: {
        id: uuidv4(),
        detail: detail,
        devSerial: serial,
        userId: userId,
        createAt: getDateFormat(new Date()),
        updateAt: getDateFormat(new Date())
      },
      include: { device: true }
    });
    await removeCache("history");
    return result;
  } catch (error) {
    throw error;
  }
}

export {
  addHistory,
  historyList
}