import { NextFunction, Request, Response } from "express";
import { Repairs } from "@prisma/client";
import { BaseResponse } from "../models";
import { addRepair, editRepair, findRepair, removeRepair, repairList } from "../services";
import { ZRepair, ZRepairParam } from "../models";

const getRepair = async (req: Request, res: Response<BaseResponse<Repairs[]>>, next: NextFunction) => {
  try {
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await repairList(res.locals.token)
    });
  } catch (error) {
    next(error);
  }
}

const getRepairById = async (req: Request, res: Response<BaseResponse<Repairs | null>>, next: NextFunction) => {
  try {
    const params = ZRepairParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await findRepair(params.repairId)
    });
  } catch (error) {
    next(error);
  }
}

const createRepair = async (req: Request, res: Response<BaseResponse<Repairs>>, next: NextFunction) => {
  try {
    const body = ZRepair.parse(req.body);
    res.status(201).json({
      message: 'Successful',
      success: true,
      data: await addRepair(body as Repairs)
    });
  } catch (error) {
    next(error);
  }
}

const updateRepair = async (req: Request, res: Response<BaseResponse<Repairs>>, next: NextFunction) => {
  try {
    const params = ZRepairParam.parse(req.params);
    const body = ZRepair.parse(req.body);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await editRepair(params.repairId, body as Repairs)
    });
  } catch (error) {
    next(error);
  }
}

const deleteRepair = async (req: Request, res: Response<BaseResponse<Repairs>>, next: NextFunction) => {
  try {
    const params = ZRepairParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await removeRepair(params.repairId)
    });
  } catch (error) {
    next(error);
  }
}

export {
  getRepair,
  getRepairById,
  createRepair,
  updateRepair,
  deleteRepair
};
