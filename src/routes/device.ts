import { Router } from "express";
import { verifyToken, upload, isSuperAdmin, isAdmin } from "../middlewares";
import { getDeviceByid, createDevice, updateDevice, deleteDevice, changeSeq, versionUpdate, getDeviceWithLog } from "../controllers";
const deviceRouter: Router = Router();

deviceRouter.get('/', verifyToken, getDeviceWithLog);
deviceRouter.get('/:devId', verifyToken, getDeviceByid);
deviceRouter.post('/', verifyToken, isSuperAdmin, upload.single('fileupload'), createDevice);
deviceRouter.put('/:devId', verifyToken, isAdmin, upload.single('fileupload'), updateDevice);
deviceRouter.delete('/:devId', verifyToken, isSuperAdmin, deleteDevice);
deviceRouter.patch('/:devId/:afterDevId', verifyToken, changeSeq);
deviceRouter.patch('/firmware/version/:devSerial', versionUpdate);

export default deviceRouter; 