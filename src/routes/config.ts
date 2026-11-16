import { Router } from "express";
import { getConfigById } from "../controllers";
const configRouter = Router();

configRouter.get('/:devSerial', getConfigById);

export default configRouter;
