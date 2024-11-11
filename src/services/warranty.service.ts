import { Warranties } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { prisma } from "../configs";
import { getDateFormat } from "../utils";
import { NotFoundError } from "../error";
import { format, toDate } from "date-fns";
import { ResToken } from "../models";

const warrantyList = async (token: ResToken): Promise<Warranties[]> => {
  try {
    const result = await prisma.warranties.findMany({
      where: token.userLevel === "3" ? { device: { wardId: token.wardId } } : 
      token.userLevel === "2" ? { device: { ward: { hosId: token.hosId } } } : {},
      include: { device: true }
    });
    return result;
  } catch (error) {
    throw error;
  }
}

const findWarranty = async (warrId: string): Promise<Warranties | null> => {
  try {
    const result = await prisma.warranties.findUnique({
      where: { warrId: warrId },
      include: { device: true }
    });
    if (!result) throw new NotFoundError(`Warranty not found for : ${warrId}`);
    return result;
  } catch (error) {
    throw error;
  }
}

const addWarranty = async (body: Warranties) => {
  try {
    body.warrId = `CID-${uuidv4()}`;
    if (body.expire) {
      body.expire = getDateFormat(body.expire);
    } else {
      body.expire = toDate(format(new Date(new Date().getFullYear(), new Date().getMonth() + 12, new Date().getDate()), "yyyy-MM-dd'T'HH:mm:ss'Z'"));
    }
    body.createAt = getDateFormat(new Date());
    body.updateAt = getDateFormat(new Date());
    const result = prisma.warranties.create({
      data: body,
      include: { device: true }
    });
    return result;
  } catch (error) {
    throw error;
  }
}

const editWarranty = async (warrId: string, body: Warranties) => {
  try {
    body.expire = getDateFormat(body.expire);
    body.updateAt = getDateFormat(new Date());
    const result = prisma.warranties.update({
      where: { warrId: warrId },
      data: body
    });
    return result;
  } catch (error) {
    throw error;
  }
}

const removeWarranty = async (warrId: string) => {
  try {
    return await prisma.warranties.delete({ where: { warrId: warrId } });
  } catch (error) {
    throw error;
  }
}

export {
  warrantyList,
  findWarranty,
  addWarranty,
  editWarranty,
  removeWarranty
}
