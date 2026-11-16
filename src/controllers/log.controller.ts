import { NextFunction, Request, Response } from "express";
import { BaseResponse } from "../models";
import { addLog } from "../services";

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

export {
  createLog
};
