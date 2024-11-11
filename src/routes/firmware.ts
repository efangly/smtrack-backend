import { Router } from "express";
import { verifyToken, upload, isSuperAdmin } from "../middlewares";
import { createFirmware, deleteFirmware, getFirmwares } from "../controllers";
const firmwareRouter: Router = Router();

firmwareRouter.get('/', verifyToken, getFirmwares);
firmwareRouter.post('/', verifyToken, isSuperAdmin, upload.single('fileupload'), createFirmware);
firmwareRouter.delete('/:filename', verifyToken, isSuperAdmin, deleteFirmware);

export default firmwareRouter; 