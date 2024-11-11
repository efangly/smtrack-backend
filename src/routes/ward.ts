import { Router } from "express";
import { isAdmin, verifyToken } from "../middlewares/auth";
import { getWard, getWardById, createWard, updateWard, deleteWard } from "../controllers";

const wardRouter: Router = Router();

wardRouter.get('/', verifyToken, getWard);
wardRouter.get('/:wardId', verifyToken, getWardById);
wardRouter.post('/', verifyToken, isAdmin, createWard);
wardRouter.put('/:wardId', verifyToken, isAdmin, updateWard);
wardRouter.delete('/:wardId', verifyToken, isAdmin, deleteWard);

export default wardRouter; 