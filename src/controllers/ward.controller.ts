import { NextFunction, Request, Response } from "express";
import { Wards } from "@prisma/client";
import { BaseResponse } from "../models";
import { addWard, editWard, findWard, removeWard, wardList } from "../services";
import { ZWard, ZWardParam } from "../models";

const getWard = async (req: Request, res: Response<BaseResponse<Wards[]>>, next: NextFunction) => {
  try {
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await wardList(res.locals.token)
    });
  } catch (error) {
    next(error);
  }
}

const getWardById = async (req: Request, res: Response<BaseResponse<Wards | null>>, next: NextFunction) => {
  try {
    const params = ZWardParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await findWard(params.wardId)
    });
  } catch (error) {
    next(error);
  }
}

const createWard = async (req: Request, res: Response<BaseResponse<Wards>>, next: NextFunction) => {
  try {
    const body = ZWard.parse(req.body);
    res.status(201).json({
      message: 'Successful',
      success: true,
      data: await addWard(body as Wards)
    });
  } catch (error) {
    next(error);
  }
}

const updateWard = async (req: Request, res: Response<BaseResponse<Wards>>, next: NextFunction) => {
  try {
    const params = ZWardParam.parse(req.params);
    const body = ZWard.parse(req.body);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await editWard(params.wardId, body as Wards)
    });
  } catch (error) {
    next(error);
  }
}
 
const deleteWard = async (req: Request, res: Response<BaseResponse<Wards>>, next: NextFunction) => {
  try {
    const params = ZWardParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await removeWard(params.wardId)
    });
  } catch (error) {
    next(error);
  }
}

export {
  getWard,
  getWardById,
  createWard,
  updateWard,
  deleteWard
};