import { prisma } from "../configs";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { Users } from "@prisma/client";
import { getDateFormat, removeCache } from "../utils";
import { ResLogin, ResToken, TLogin, TRegisUser, TResetPass } from "../models";
import { HttpError } from "../error";

const regisUser = async (params: TRegisUser, pic?: Express.Multer.File): Promise<Users> => {
  try {
    const result = await prisma.users.create({
      select: {
        userId: true,
        userLevel: true,
        ward: { include: { hospital: true } }
      },
      data: {
        userId: `UID-${params.userId || uuidv4()}`,
        wardId: params.wardId,
        userName: params.userName,
        userPassword: await hashPassword(params.userPassword),
        userLevel: params.userLevel,
        displayName: params.displayName,
        userPic: !pic ? null : `/img/user/${pic.filename}`,
        createBy: params.createBy || null,
        createAt: getDateFormat(new Date()),
        updateAt: getDateFormat(new Date())
      }
    });
    await removeCache("user");
    await removeCache("ward");
    await removeCache("hospital");
    return result as unknown as Users;
  } catch (error) {
    throw error;
  }
}

const userLogin = async (login: TLogin): Promise<ResLogin> => {
  try {
    const result = await prisma.users.findUnique({
      where: { userName: login.username },
      include: { ward: { include: { hospital: true } } }
    });
    if (result) {
      if (!result.userStatus) throw new HttpError(400, "User is disabled!!");
      const match = await bcrypt.compare(login.password, result.userPassword);
      if (match) {
        const userId: string = result.userId;
        const hosId: string = result.ward.hospital.hosId;
        const userName: string = result.userName;
        const displayName: string | null = result.displayName;
        const userPic: string | null = result.userPic;
        const userLevel: string | null = result.userLevel;
        const hosPic: string | null = result.ward.hospital.hosPic;
        const hosName: string | null = result.ward.hospital.hosName;
        const wardId: string | null = result.wardId;
        const userStatus: boolean = result.userStatus;
        const token: string = sign({ userId, userLevel, hosId, wardId }, String(process.env.JWT_SECRET), { expiresIn: String(process.env.EXPIRE_TIME) });
        return { token, userId, hosId, wardId, userLevel, hosPic, hosName, userStatus, userName, displayName, userPic };
      } else {
        throw new HttpError(400, "Wrong user or password!!");
      }
    } else {
      throw new HttpError(400, "Wrong user or password!!");
    }
  } catch (error) {
    throw error;
  }
}

const resetPassword = async (password: TResetPass, userId: string, token: ResToken): Promise<string> => {
  try {
    if (token.userLevel === "4"  || token.userLevel === "3" || token.userLevel === "2") {
      const result = await prisma.users.findUnique({
        where: { userId: userId },
        select: { userPassword: true }
      });
      if (!result) throw new HttpError(400, "User not found!!");
      if (!password.oldPassword) throw new HttpError(400, "User not have password!!");
      const match = await bcrypt.compare(password.oldPassword, result.userPassword);
      if (!match) throw new HttpError(400, "Old password not match!!");
    }
    await prisma.users.update({
      where: { userId: userId },
      data: {
        userPassword: await hashPassword(password.password),
        updateAt: getDateFormat(new Date())
      }
    });
    await removeCache("user");
    return "Reset password success!!";
  } catch (error) {
    throw error;
  }
}

const hashPassword = (pass: string) => {
  return new Promise<string>((resolve, reject) => {
    bcrypt.hash(pass, 10, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
}

export { regisUser, userLogin, resetPassword };