import { Notifications } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { BaseResponse, ZNoti } from "../models";
import { addNotification } from "../services";

const setPushNotification = async (req: Request, res: Response<BaseResponse<Notifications>>, next: NextFunction) => {
  try {
    const body = ZNoti.parse(req.body);
    res.status(201).json({
      message: 'Successful',
      success: true,
      data: await addNotification(body as Notifications)
    });
  } catch(error) {
    next(error);
  }
};

export {
  setPushNotification
};
