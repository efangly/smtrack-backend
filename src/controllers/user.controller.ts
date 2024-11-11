import { NextFunction, Request, Response } from "express";
import { Users } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";
import { BaseResponse } from "../models";
import { delUser, editUser, getAllUser, getUserByUserId } from "../services";
import { ZUserBody, ZUserParam } from "../models";

const getUser = async (req: Request, res: Response<BaseResponse<Users[]>>, next: NextFunction) => {
  try {
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await getAllUser(res.locals.token)
    });
  } catch (error) {
    next(error);
  }
}

const getUserById = async (req: Request, res: Response<BaseResponse<Users | null>>, next: NextFunction) => {
  try {
    const params = ZUserParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await getUserByUserId(params.userId)
    });
  } catch (error) {
    next(error);
  }
}

const updateUser = async (req: Request, res: Response<BaseResponse<Users>>, next: NextFunction) => {
  try {
    const body = ZUserBody.parse(req.body);
    const params = ZUserParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await editUser(params.userId, body as unknown as Users, req.file)
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(path.join('public/images/user', String(req.file.filename)));
    next(error);
  }
}
const deleteUser = async (req: Request, res: Response<BaseResponse<Users>>, next: NextFunction) => {
  try {
    const params = ZUserParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await delUser(params.userId)
    });
  } catch (error) {
    next(error);
  }
}

export {
  getUser,
  getUserById,
  updateUser,
  deleteUser
};