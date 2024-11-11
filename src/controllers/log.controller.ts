import { NextFunction, Request, Response } from "express";
import { LogDays } from "@prisma/client";
import { BaseResponse, ZConfigParam, ZLogParam, ZQueryLog } from "../models";
import { logList, findLog, addLog, removeLog, backupLog } from "../services";

const getLog = async (req: Request, res: Response<BaseResponse<LogDays[]>>, next: NextFunction) => {
  try {
    const query = ZQueryLog.parse(req.query);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await logList(query, res.locals.token)
    });
  } catch (error) {
    next(error);
  }
}

const getLogById = async (req: Request, res: Response<BaseResponse<LogDays>>, next: NextFunction) => {
  try {
    const params = ZLogParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await findLog(params.logId)
    });
  } catch (error) {
    next(error);
  }
}

const createLog = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
  try {
    res.status(201).json({
      message: 'Successful',
      success: true,
      data: await addLog(req.body)
    });
  } catch (error) {
    next(error);
  }
};

const deleteLog = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
  try {
    const params = ZConfigParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await removeLog(params.devSerial)
    });
  } catch (error) {
    next(error);
  }
}

const backupData = async (req: Request, res: Response<BaseResponse<string>>, next: NextFunction) => {
  try {
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await backupLog()
    });
  } catch (error) {
    next(error);
  }
}

export {
  getLog,
  getLogById,
  createLog,
  deleteLog,
  backupData
};