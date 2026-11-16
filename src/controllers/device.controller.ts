import { NextFunction, Request, Response } from "express";
import { Devices } from "@prisma/client";
import { BaseResponse, ZConfigParam } from "../models";
import { findConfigById } from "../services";

const getConfigById = async (req: Request, res: Response<BaseResponse<Devices | null>>, next: NextFunction) => {
  try {
    const params = ZConfigParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await findConfigById(params.devSerial)
    });
  } catch (error) {
    next(error);
  }
};

export {
  getConfigById
};
