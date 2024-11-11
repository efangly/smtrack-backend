import { Router } from "express";
import { isService, isSuperAdmin, verifyToken } from "../middlewares";
import { getWarranty, getWarrantyById, createWarranty, updateWarranty, deleteWarranty } from "../controllers";

const warrantyRouter: Router = Router();

warrantyRouter.get('/', verifyToken, getWarranty);
warrantyRouter.get('/:warrId', verifyToken, getWarrantyById);
warrantyRouter.post('/', verifyToken, isService, createWarranty);
warrantyRouter.put('/:warrId', verifyToken, isService, updateWarranty);
warrantyRouter.delete('/:warrId', verifyToken, isSuperAdmin, deleteWarranty);

export default warrantyRouter; 