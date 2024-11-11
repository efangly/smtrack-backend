import { prisma } from "../configs";
import fs from "node:fs"
import path from "node:path";
import { v4 as uuidv4 } from 'uuid';
import { getHospitalImage, getDateFormat, checkCachedData, setCacheData, removeCache } from "../utils";
import { Hospitals, Prisma } from "@prisma/client";
import { NotFoundError, ValidationError } from "../error";
import { ResToken } from "../models";

const hospitalList = async (token: ResToken): Promise<Hospitals[]> => {
  try {
    let conditions: Prisma.HospitalsWhereInput | undefined = undefined;
    let keyName = "";
    switch (token.userLevel) {
      case "2":
        conditions = { hosId: token.hosId };
        keyName = `hospital:${token.hosId}`;
        break;
      case "1":
        conditions = { NOT: { hosId: "HID-DEVELOPMENT" } };
        keyName = "hospital:HID-DEVELOPMENT";
        break;
      default:
        conditions = undefined;
        keyName = "hospital";
    }
    // get cache
    const cache =  await checkCachedData(keyName);
    if (cache) return JSON.parse(cache) as unknown as Hospitals[];
    const result = await prisma.hospitals.findMany({ 
      where: conditions,
      include: { ward: { orderBy: { wardSeq: 'asc' } } },
      orderBy: { hosName: 'asc' }
    });
    // set cache
    await setCacheData(keyName, 3600, JSON.stringify(result));
    return result;
  } catch (error) {
    throw error;
  }
}

const findHospital = async (hosId: string): Promise<Hospitals | null> => {
  try {
    const result = await prisma.hospitals.findUnique({ 
      where: { hosId: hosId },
      include: { ward: true }  
    });
    if (!result) throw new NotFoundError(`Hospital not found for : ${hosId}`);
    return result;
  } catch (error) {
    throw error;
  }
}

const addHospital = async (body: Hospitals, pic?: Express.Multer.File): Promise<Hospitals> => {
  try {
    const hosList = await prisma.hospitals.findFirst({ where: { hosName: body.hosName } });
    if (!!hosList) throw new ValidationError("Hosname already exists!!");
    body.hosId = `HOS-${uuidv4()}`;
    body.hosPic = pic ? `/img/hospital/${pic.filename}` : null;
    body.createAt = getDateFormat(new Date());
    body.updateAt = getDateFormat(new Date());
    await removeCache("hospital");
    return await prisma.hospitals.create({ data: body });
  } catch (error) {
    throw error;
  }
};

const editHospital = async (hosId: string, body: Hospitals, pic?: Express.Multer.File) => {
  try {
    const filename = await getHospitalImage(hosId);
    body.hosPic = pic ? `/img/hospital/${pic.filename}` : filename || null;
    body.updateAt = getDateFormat(new Date());
    const result = await prisma.hospitals.update({
      where: { hosId: hosId },
      data: body
    })
    if (pic && !!filename) fs.unlinkSync(path.join('public/images/hospital', filename.split("/")[3]));
    await removeCache("hospital");
    return result;
  } catch (error) {
    throw error;
  }
}

const removeHospital = async (hosId: string) => {
  try {
    const filename = await getHospitalImage(hosId);
    const result = await prisma.hospitals.delete({ where: { hosId: hosId } })
    if (!!filename) fs.unlinkSync(path.join('public/images/hospital', String(filename?.split("/")[3])));
    await removeCache("hospital");
    return result;
  } catch (error) {
    throw error;
  }
}

export {
  hospitalList,
  findHospital,
  addHospital,
  editHospital,
  removeHospital
};