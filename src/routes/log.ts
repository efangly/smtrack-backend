import { Router } from "express";
import { isSuperAdmin, validateLog, verifyToken } from "../middlewares";
import { getLog, getLogById, createLog, deleteLog } from "../controllers";
const logRouter: Router = Router();

logRouter.get('/', verifyToken, getLog);
logRouter.get('/:logId', verifyToken, getLogById);
logRouter.post('/', validateLog, createLog);
logRouter.delete('/:logId', verifyToken, isSuperAdmin, deleteLog);

export default logRouter;