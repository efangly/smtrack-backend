import { Router } from "express";
import { isAdmin, verifyToken } from "../middlewares";
import { getConfig, getConfigById, updateConfig, updateDeviceConfig } from "../controllers";
const configRouter = Router();

configRouter.get('/', getConfig);
configRouter.get('/:devSerial', getConfigById);
configRouter.put('/:devSerial', verifyToken, isAdmin, updateConfig);
configRouter.patch('/:devSerial', updateDeviceConfig);

export default configRouter;