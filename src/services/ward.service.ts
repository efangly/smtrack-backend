import { Prisma, Wards } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { prisma } from "../configs";
import { checkCachedData, getDateFormat, removeCache, setCacheData } from "../utils";
import { NotFoundError } from "../error";
import { ResToken } from "../models";

const wardList = async (token: ResToken): Promise<Wards[]> => {
  try {
    let conditions: Prisma.WardsWhereInput | undefined = undefined;
    let keyName = "";
    switch (token.userLevel) {
      case "2":
        conditions = { hosId: token.hosId };
        keyName = `ward:${token.hosId}`;
        break;
      case "1":
        conditions = { NOT: { wardId: "WID-DEVELOPMENT" } };
        keyName = "ward:WID-DEVELOPMENT";
        break;
      default:
        conditions = undefined;
        keyName = "ward";
    }
    const cache = await checkCachedData(keyName);
    if (cache) return JSON.parse(cache);
    const result = await prisma.wards.findMany({
      where: conditions,
      include: { hospital: true },
      orderBy: { wardSeq: 'asc' }
    });
    // set cache
    await setCacheData(keyName, 3600, JSON.stringify(result));
    return result;
  } catch (error) {
    throw error;
  }
}

const findWard = async (wardId: string): Promise<Wards | null> => {
  try {
    const result = await prisma.wards.findUnique({
      where: { wardId: wardId },
      include: { hospital: true }
    });
    if (!result) throw new NotFoundError(`Ward not found for : ${wardId}`);
    return result;
  } catch (error) {
    throw error;
  }
}

const addWard = async (body: Wards) => {
  try {
    const seq: Wards[] = await prisma.wards.findMany({ orderBy: { wardSeq: 'asc' } });
    body.wardId = `WID-${uuidv4()}`;
    body.wardSeq = seq.length === 0 ? 1 : seq[seq.length - 1].wardSeq + 1;
    body.createAt = getDateFormat(new Date());
    body.updateAt = getDateFormat(new Date());
    const result = prisma.wards.create({
      data: body,
      include: { hospital: true }
    });
    await removeCache("ward");
    await removeCache("hospital");
    return result;
  } catch (error) {
    throw error;
  }
}

const editWard = async (wardId: string, body: Wards) => {
  try {
    body.updateAt = getDateFormat(new Date());
    const result = prisma.wards.update({
      where: { wardId: wardId },
      data: body
    });
    await removeCache("ward");
    await removeCache("hospital");
    return result;
  } catch (error) {
    throw error;
  }
}

const removeWard = async (wardId: string) => {
  try {
    await removeCache("ward");
    await removeCache("hospital");
    return await prisma.wards.delete({ where: { wardId: wardId } });
  } catch (error) {
    throw error;
  }
}

export {
  wardList,
  findWard,
  addWard,
  editWard,
  removeWard
}
