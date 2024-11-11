import { prisma } from "../configs";
import { Prisma, Users } from "@prisma/client";
import { getUserImage, getDateFormat, checkCachedData, setCacheData, removeCache } from "../utils";
import { NotFoundError } from "../error";
import type { ResToken } from "../models";
import fs from "node:fs";
import path from "node:path";

const getAllUser = async (token: ResToken): Promise<Users[]> => {
  try {
    let conditions: Prisma.UsersWhereInput | undefined = undefined;
    let keyName: string = "";
    switch (token.userLevel) {
      case "3":
        conditions = { wardId: token.wardId };
        keyName = `user:${token.wardId}`;
        break;
      case "2":
        conditions = { ward: { hosId: token.hosId } };
        keyName = `user:${token.hosId}`;
        break;
      case "1":
        conditions = { 
          NOT: [
            { wardId: "WID-DEVELOPMENT" },
            { userLevel: "0" },
            { userLevel: "1" }
          ] 
        };
        keyName = "user:WID-DEVELOPMENT";
        break;
      default:
        conditions = undefined;
        keyName = "user";
    }
    // get cache
    const cache =  await checkCachedData(keyName);
    if (cache) return JSON.parse(cache) as unknown as Users[];
    const result = await prisma.users.findMany({
      where: conditions,
      select: {
        userId: true,
        wardId: true,
        userName: true,
        userStatus: true,
        userLevel: true,
        displayName: true,
        userPic: true,
        ward: {
          select: { wardName: true, hosId: true }
        }
      },
      orderBy: { userLevel: 'asc' }
    });
    // set cache
    await setCacheData(keyName, 3600, JSON.stringify(result));
    return result as unknown as Users[];
  } catch (error) {
    throw error;
  }
}

const getUserByUserId = async (userId: string): Promise<Users | null> => {
  try {
    const result = await prisma.users.findUnique({
      where: { userId: userId },
      select: {
        userId: true,
        wardId: true,
        userName: true,
        userStatus: true,
        userLevel: true,
        displayName: true,
        userPic: true,
        ward: {
          select: {
            wardName: true,
            hosId: true,
            hospital: {
              select: { hosName: true, hosPic: true }
            }
          },
        }
      }
    });
    if (!result) throw new NotFoundError("Not Found!!");
    return result as unknown as Users;
  } catch (error) {
    throw error;
  }
}

const editUser = async (userId: string, body: Users, pic?: Express.Multer.File): Promise<Users> => {
  try {
    const filename = await getUserImage(userId);
    if (body.userStatus) body.userStatus = String(body.userStatus) == "1" ? true : false;
    body.userPic = !pic ? filename || null : `/img/user/${pic.filename}`;
    body.updateAt = getDateFormat(new Date());
    const result = await prisma.users.update({
      where: { userId: userId },
      data: body
    });
    if (pic && !!filename) fs.unlinkSync(path.join('public/images/user', filename.split("/")[3]));
    await removeCache("user");
    return result;
  } catch (error) {
    throw error;
  }
}

const delUser = async (userId: string): Promise<Users> => {
  try {
    const filename = await getUserImage(userId);
    const result = await prisma.users.delete({
      where: { userId: userId }
    });
    if (!!filename) fs.unlinkSync(path.join('public/images/user', filename.split("/")[3]));
    await removeCache("user");
    return result;
  } catch (error) {
    throw error;
  }
}


export { getAllUser, getUserByUserId, editUser, delUser };