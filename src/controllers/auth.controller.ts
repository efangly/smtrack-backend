import { NextFunction, Request, Response } from "express";
import { BaseResponse, TResetPass } from "../models";
import { regisUser, resetPassword, userLogin } from "../services";
import { ResLogin, ZLogin, ZRegisUser, ZResetPass, ZUserParam } from "../models";
import { Users } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

const register = async (req: Request, res: Response<BaseResponse<Users>>, next: NextFunction) => {
  try {
    const body = ZRegisUser.parse(req.body);
    const pic = req.file;
    res.status(201).json({
      message: 'Successful',
      success: true,
      data: await regisUser(body, pic)
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(path.join('public/images/user', String(req.file.filename)));
    next(error);
  }
};

const checkLogin = async (req: Request, res: Response<BaseResponse<ResLogin>>, next: NextFunction) => {
  try {
    const login = ZLogin.parse(req.body);
    res.json({
      message: 'Successful',
      success: true,
      data: await userLogin(login)
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req: Request, res: Response<BaseResponse<string>>, next: NextFunction) => {
  try {
    const params = ZUserParam.parse(req.params);
    const body: TResetPass = ZResetPass.parse(req.body);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await resetPassword(body, params.userId, res.locals.token)
    });
  } catch (error) {
    next(error);
  }
};

export {
  checkLogin,
  register,
  changePassword
};