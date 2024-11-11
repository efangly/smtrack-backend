import { Request, Response, NextFunction } from 'express';
import { BaseResponse } from "../models";
import { HttpError } from '../error';
import { createLog } from '../utils';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";

export const globalErrorHanlder = (error: unknown, req: Request, res: Response<BaseResponse<null>>, next: NextFunction) => {
  let statusCode = 500;
  let message = '';
  if (error instanceof HttpError) {
    statusCode = error.statusCode;
  }
  if (error instanceof Error) {
    if (error instanceof PrismaClientKnownRequestError) {
      statusCode = 400;
      message = `PrismaError: ${error.code} [${error.meta?.modelName}: ${error.meta?.cause}]`;
    } else if (error instanceof z.ZodError) {
      statusCode = 400;
      message = fromZodError(error).toString();
    } else {
      message = `${error.name}: ${error.message}`;
    }
    console.error(`${error.name}: ${error.message}`); 
  } else {
    console.error('An unknown error occurred');
    message = `An unknown error occurred, ${String(error)}`;
  }
  if (statusCode !== 401) createLog(`${req.method} ${req.originalUrl} ${statusCode}`, message);
  res.status(statusCode).send({
    message,
    success: false,
    data: null,
    traceStack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
  });
}

