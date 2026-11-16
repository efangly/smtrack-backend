import { Router } from "express";
import { validateLog } from "../middlewares";
import { createLog } from "../controllers";
const logRouter: Router = Router();

logRouter.post('/', validateLog, createLog);

export default logRouter;
