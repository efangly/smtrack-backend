import { Router } from "express";
import { register, checkLogin, changePassword } from "../controllers";
import { upload, verifyToken } from "../middlewares";
const authRouter = Router();

authRouter.post('/login', checkLogin);
authRouter.post('/register', upload.single('fileupload'), register);
authRouter.patch('/reset/:userId', verifyToken, changePassword);

export default authRouter;