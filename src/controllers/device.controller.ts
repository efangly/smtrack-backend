import { NextFunction, Request, Response } from "express";
import fs from "node:fs"
import path from "node:path";
import { Configs, Devices } from "@prisma/client";
import { BaseResponse, ZAdjustConfig, ZChangeSeqBody, ZChangeSeqParam, ZQueryDevice } from "../models";
import { TDevice, ZConfig, ZConfigParam, ZDevice, ZDeviceParam } from "../models";
import { 
  addDevice, 
  compareDevice, 
  deviceById, 
  deviceList, 
  editConfig, 
  editDevice, 
  editSequence, 
  findConfigById, 
  removeDevice, 
  findConfig,
  updateFirmware, 
  deviceWithLog,
  editDeviceConfig
} from "../services";

const getDevice = async (req: Request, res: Response<BaseResponse<Devices[]>>, next: NextFunction) => {
  try {
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await deviceList()
    });
  } catch (error) {
    next(error);
  }
};

const getDeviceWithLog = async (req: Request, res: Response<BaseResponse<Devices[]>>, next: NextFunction) => {
  try {
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await deviceWithLog(res.locals.token)
    });
  } catch (error) {
    next(error);
  }
};
 
const getDeviceByid = async (req: Request, res: Response<BaseResponse<Devices | null>>, next: NextFunction) => {
  try {
    const params = ZDeviceParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await deviceById(params.devId)
    });
  } catch (error) {
    next(error);
  }
};

const createDevice = async (req: Request, res: Response<BaseResponse<Devices>>, next: NextFunction) => {
  try {
    const body = ZDevice.parse(req.body);
    res.status(201).json({
      message: 'Successful',
      success: true,
      data: await addDevice(body as unknown as TDevice, req.file)
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(path.join('public/images/device', req.file.filename));
    next(error);
  }
};

const updateDevice = async (req: Request, res: Response<BaseResponse<Devices>>, next: NextFunction) => {
  try {
    const params = ZDeviceParam.parse(req.params);
    const body = ZDevice.parse(req.body);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await editDevice(params.devId, body as unknown as Devices, res.locals.token, req.file)
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(path.join('public/images/device', req.file.filename));
    next(error);
  }
};

const versionUpdate = async (req: Request, res: Response<BaseResponse<Devices>>, next: NextFunction) => {
  try {
    const body = ZDevice.parse(req.body);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await updateFirmware(req.params.devSerial, body as unknown as Devices)
    });
  } catch (error) {
    next(error);
  }
}

const deleteDevice = async (req: Request, res: Response<BaseResponse<Devices>>, next: NextFunction) => {
  try {
    const params = ZDeviceParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await removeDevice(params.devId)
    });
  } catch (error) {
    next(error);
  }
};

const getConfig = async (req: Request, res: Response<BaseResponse<Configs[]>>, next: NextFunction) => {
  try {
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await findConfig()
    });
  } catch (error) {
    next(error);
  }
}

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

const updateConfig = async (req: Request, res: Response<BaseResponse<Configs>>, next: NextFunction) => {
  try {
    const params = ZConfigParam.parse(req.params);
    const body = ZConfig.parse(req.body);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await editConfig(params.devSerial, body as unknown as Configs, res.locals.token)
    });
  } catch (error) {
    next(error);
  }
};

const updateDeviceConfig = async (req: Request, res: Response<BaseResponse<Devices>>, next: NextFunction) => {
  try {
    const params = ZConfigParam.parse(req.params);
    const body = ZAdjustConfig.parse(req.body);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await editDeviceConfig(params.devSerial, body)
    });
  } catch (error) {
    next(error);
  }
};

const changeSeq = async (req: Request, res: Response<BaseResponse<boolean>>, next: NextFunction) => {
  try {
    const params = ZChangeSeqParam.parse(req.params);
    const body = ZChangeSeqBody.parse(req.body);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await editSequence(params.devId, body.devSeq, params.afterDevId, body.afterDevSeq)
    });
  } catch (error) {
    next(error);
  }
}

const getCompareDevice = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
  try {
    const query = ZQueryDevice.parse(req.query);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await compareDevice(query, res.locals.token)
    });
  } catch (error) {
    next(error);
  }
}

export {
  getDevice,
  getDeviceWithLog,
  getDeviceByid,
  createDevice,
  updateDevice,
  deleteDevice,
  getConfig,
  getConfigById,
  updateConfig,
  changeSeq,
  getCompareDevice,
  versionUpdate,
  updateDeviceConfig
};