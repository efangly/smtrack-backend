import { Router } from "express";
import { verifyToken, upload, isSuperAdmin, isAdmin } from "../middlewares";
import { getHospital, getHospitalById, createHospital, updateHospital, deleteHospital } from "../controllers";

const hospitalRouter: Router = Router();

hospitalRouter.get('/', verifyToken, isAdmin, getHospital);
hospitalRouter.get('/:hosId', verifyToken, isAdmin, getHospitalById);
hospitalRouter.post('/', verifyToken, isSuperAdmin, upload.single('fileupload'), createHospital);
hospitalRouter.put('/:hosId', verifyToken, isSuperAdmin, upload.single('fileupload'), updateHospital);
hospitalRouter.delete('/:hosId', verifyToken, isSuperAdmin, deleteHospital);

export default hospitalRouter;