import fs from "node:fs"
import path from "node:path";
import { NextFunction, Request, Response } from "express";
import { Hospitals } from "@prisma/client";
import { BaseResponse } from "../models";
import { addHospital, editHospital, findHospital, hospitalList, removeHospital } from "../services";
import { ZHospital, ZHospitalParam } from "../models";

const getHospital = async (req: Request, res: Response<BaseResponse<Hospitals[]>>, next: NextFunction) => {
  try {
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await hospitalList(res.locals.token)
    });
  } catch (error) {
    next(error);
  }
}

const getHospitalById = async (req: Request, res: Response<BaseResponse<Hospitals | null>>, next: NextFunction) => {
  try {
    const params = ZHospitalParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await findHospital(params.hosId)
    });
  } catch (error) {
    next(error);
  }
}

const createHospital = async (req: Request, res: Response<BaseResponse<Hospitals>>, next: NextFunction) => {
  try {
    const body = ZHospital.parse(req.body);
    res.status(201).json({
      message: 'Successful',
      success: true,
      data: await addHospital(body as unknown as Hospitals, req.file)
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(path.join('public/images/hospital', req.file.filename));
    next(error);
  }
};

const updateHospital = async (req: Request, res: Response<BaseResponse<Hospitals>>, next: NextFunction) => {
  try {
    const params = ZHospitalParam.parse(req.params);
    const body = ZHospital.parse(req.body);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await editHospital(params.hosId, body as unknown as Hospitals, req.file)
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(path.join('public/images/hospital', req.file.filename));
    next(error);
  }
}

const deleteHospital = async (req: Request, res: Response<BaseResponse<Hospitals>>, next: NextFunction) => {
  try {
    const params = ZHospitalParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await removeHospital(params.hosId)
    });
  } catch (error) {
    next(error);
  }
}

export {
  getHospital,
  getHospitalById,
  createHospital,
  updateHospital,
  deleteHospital
};