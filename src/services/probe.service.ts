import { Prisma, Probes } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { prisma } from "../configs";
import { checkCachedData, getDateFormat, objToString, removeCache, setCacheData } from "../utils";
import { NotFoundError } from "../error";
import { ResToken } from "../models";
import { addHistory } from "./history.service";

const probeList = async (token: ResToken): Promise<Probes[]> => {
  try {
    let conditions: Prisma.ProbesWhereInput | undefined = undefined;
    let keyName = "";
    switch (token.userLevel) {
      case "4":
        conditions = { device: { wardId: token.wardId } };
        keyName = `probe:${token.wardId}`;
        break;
      case "3":
        conditions = { device: { wardId: token.wardId } };
        keyName = `probe:${token.wardId}`;
        break;
      case "2":
        conditions = { device: { ward: { hosId: token.hosId } } };
        keyName = `probe:${token.hosId}`;
        break;
      case "1":
        conditions = { device: { NOT: { wardId: "WID-DEVELOPMENT" } } };
        keyName = "probe:WID-DEVELOPMENT";
        break;
      default:
        conditions = undefined;
        keyName = "probe";
    }
    const cache =  await checkCachedData(keyName);
    if (cache) return JSON.parse(cache);
    const result = await prisma.probes.findMany({
      where: conditions,
      include: { device: { include: { ward: true } } }
    });
    // set cache
    await setCacheData(keyName, 3600, JSON.stringify(result));
    return result;
  } catch (error) {
    throw error;
  }
}

const findProbe = async (probeId: string): Promise<Probes | null> => {
  try {
    const result = await prisma.probes.findUnique({
      where: { probeId: probeId },
      include: { device: true }
    });
    if (!result) throw new NotFoundError(`Probe not found for : ${probeId}`);
    return result;
  } catch (error) {
    throw error;
  }
}

const addProbe = async (body: Probes) => {
  try {
    body.probeId = `PID-${uuidv4()}`;
    body.createAt = getDateFormat(new Date());
    body.updateAt = getDateFormat(new Date());
    const result = prisma.probes.create({
      data: body,
      include: { device: true }
    });
    await removeCache("probe");
    await removeCache("device");
    return result;
  } catch (error) {
    throw error;
  }
}

const editProbe = async (probeId: string, body: Probes, token: ResToken) => {
  try {
    const detail = objToString(body);
    body.updateAt = getDateFormat(new Date());
    const result = await prisma.probes.update({
      where: { probeId: probeId },
      data: body
    });
    await addHistory(`Probe: [${detail}]`, result.devSerial, token.userId);
    await removeCache("probe");
    await removeCache("device");
    return result;
  } catch (error) {
    throw error;
  }
}

const removeProbe = async (probeId: string) => {
  try {
    await removeCache("probe");
    await removeCache("device");
    return await prisma.probes.delete({ where: { probeId: probeId } });
  } catch (error) {
    throw error;
  }
}

export {
  probeList,
  findProbe,
  addProbe,
  editProbe,
  removeProbe
}