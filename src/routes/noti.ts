import { Router } from "express";
import { getNotification, getNotificationByDevice, setToReadNoti, setPushNotification } from "../controllers"; 
import { verifyToken } from "../middlewares";
const notiRouter: Router = Router();

notiRouter.get('/', verifyToken, getNotification);
notiRouter.get('/:devSerial', verifyToken, getNotificationByDevice);
notiRouter.patch('/:notiId', verifyToken, setToReadNoti);
notiRouter.post('/', setPushNotification);

export default notiRouter;