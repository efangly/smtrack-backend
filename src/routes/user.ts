import { Router } from "express";
import { deleteUser, getUser, getUserById, updateUser} from "../controllers";
import { verifyToken, upload, isAdmin } from "../middlewares";

const userRouter: Router = Router();

//user 
userRouter.get('/', verifyToken, getUser);
userRouter.get('/:userId', verifyToken, getUserById);
userRouter.put('/:userId', verifyToken, isAdmin, upload.single('fileupload'), updateUser);
userRouter.delete('/:userId', verifyToken, isAdmin, deleteUser);

export default userRouter;