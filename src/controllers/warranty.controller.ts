import { NextFunction, Request, Response } from "express";
import { Warranties } from "@prisma/client";
import { BaseResponse } from "../models";
import { addWarranty, editWarranty, findWarranty, removeWarranty, warrantyList } from "../services";
import { ZWarranty, ZWarrantyParam } from "../models";

const getWarranty = async (req: Request, res: Response<BaseResponse<Warranties[]>>, next: NextFunction) => {
  try {
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await warrantyList(res.locals.token)
    });
  } catch (error) {
    next(error);
  }
}

const getWarrantyById = async (req: Request, res: Response<BaseResponse<Warranties | null>>, next: NextFunction) => {
  try {
    const params = ZWarrantyParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await findWarranty(params.warrId)
    });
  } catch (error) {
    next(error);
  }
}

const createWarranty = async (req: Request, res: Response<BaseResponse<Warranties>>, next: NextFunction) => {
  try {
    const body = ZWarranty.parse(req.body);
    res.status(201).json({
      message: 'Successful',
      success: true,
      data: await addWarranty(body as unknown as Warranties)
    });
  } catch (error) {
    next(error);
  }
}

const updateWarranty = async (req: Request, res: Response<BaseResponse<Warranties>>, next: NextFunction) => {
  try {
    const params = ZWarrantyParam.parse(req.params);
    const body = ZWarranty.parse(req.body);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await editWarranty(params.warrId, body as unknown as Warranties)
    });
  } catch (error) {
    next(error);
  }
}
 
const deleteWarranty = async (req: Request, res: Response<BaseResponse<Warranties>>, next: NextFunction) => {
  try {
    const params = ZWarrantyParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await removeWarranty(params.warrId)
    });
  } catch (error) {
    next(error);
  }
}

export {
  getWarranty,
  getWarrantyById,
  createWarranty,
  updateWarranty,
  deleteWarranty
};