import { NextFunction, Request, Response } from "express";
import { Probes } from "@prisma/client";
import { BaseResponse } from "../models";
import { addProbe, editProbe, findProbe, probeList, removeProbe } from "../services";
import { ZProbe, ZProbeParam } from "../models";


const getProbe = async (req: Request, res: Response<BaseResponse<Probes[]>>, next: NextFunction) => {
  try {
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await probeList(res.locals.token)
    });
  } catch (error) {
    next(error);
  }
}

const getProbeById = async (req: Request, res: Response<BaseResponse<Probes | null>>, next: NextFunction) => {
  try {
    const params = ZProbeParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await findProbe(params.probeId)
    });
  } catch (error) {
    next(error);
  }
}

const createProbe = async (req: Request, res: Response<BaseResponse<Probes>>, next: NextFunction) => {
  try {
    const body = ZProbe.parse(req.body);
    res.status(201).json({
      message: 'Successful',
      success: true,
      data: await addProbe(body as unknown as Probes)
    });
  } catch (error) {
    next(error);
  }
}

const updateProbe = async (req: Request, res: Response<BaseResponse<Probes>>, next: NextFunction) => {
  try {
    const params = ZProbeParam.parse(req.params);
    const body = ZProbe.parse(req.body);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await editProbe(params.probeId, body as unknown as Probes, res.locals.token)
    });
  } catch (error) {
    next(error);
  }
}
 
const deleteProbe = async (req: Request, res: Response<BaseResponse<Probes>>, next: NextFunction) => {
  try {
    const params = ZProbeParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await removeProbe(params.probeId)
    });
  } catch (error) {
    next(error);
  }
}

export {
  getProbe,
  getProbeById,
  createProbe,
  updateProbe,
  deleteProbe
};