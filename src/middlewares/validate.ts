import { Request, Response, NextFunction } from "express";
import { fromZodError } from "zod-validation-error";
import { ZLogType } from "../models";
import { ValidationError } from "../error";

export const validateLog = (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = ZLogType.safeParse(req.body);
    if (!result.success) {
      next(new ValidationError(`${fromZodError(result.error).toString()}, ${req.body.toString()}`));
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}