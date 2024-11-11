import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError, TokenExpiredError, verify } from "jsonwebtoken";
import { HttpError } from "../error";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.headers.authorization) {
      const token: string = req.headers.authorization.split(" ")[1];
      const decoded = verify(String(token), String(process.env.JWT_SECRET));
      res.locals.token = decoded;
      next();
    } else {
      next(new HttpError(401, "Invalid token!!"));
    }
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      next(new HttpError(401, `${error.name} : ${error.message}`));
    } else if (error instanceof TokenExpiredError) {
      next(new HttpError(401, `${error.name} : ${error.message}`));
    } else {
      next(new HttpError(401, `An unknown error occurred, ${String(error)}`));
    }
  }
}

export const isSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.token.userLevel === "0") {
    next();
  } else {
    next(new HttpError(403, "Access denied"));
  }
}

export const isService = (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.token.userLevel === "0" || res.locals.token.userLevel === "1") {
    next();
  } else {
    next(new HttpError(403, "Access denied"));
  }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.token.userLevel === "3" || res.locals.token.userLevel === "4") {
    next(new HttpError(403, "Access denied"));
  } else {
    next();
  }
}
