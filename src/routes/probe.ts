import { Router } from "express";
import { isSuperAdmin, verifyToken } from "../middlewares";
import { getProbe, getProbeById, createProbe, updateProbe, deleteProbe } from "../controllers";

const probeRouter: Router = Router();

probeRouter.get('/', verifyToken, getProbe);
probeRouter.get('/:probeId', verifyToken, getProbeById);
probeRouter.post('/', verifyToken, isSuperAdmin, createProbe);
probeRouter.put('/:probeId', verifyToken, updateProbe);
probeRouter.delete('/:probeId', verifyToken, isSuperAdmin, deleteProbe);

export default probeRouter; 