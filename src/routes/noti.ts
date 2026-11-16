import { Router } from "express";
import { setPushNotification } from "../controllers"; 
const notiRouter: Router = Router();

notiRouter.post('/', setPushNotification);

export default notiRouter;
