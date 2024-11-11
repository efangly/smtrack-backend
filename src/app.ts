import express,{ Application, NextFunction, Response, Request } from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { prisma, socket, initRedis } from "./configs";
import routes from "./routes";
import { globalErrorHanlder } from "./middlewares";
import { initQueue } from "./services";

const app: Application = express();

dotenv.config();
const port: number = parseInt(process.env.PORT as string, 10) || 8080;

//middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  express.json()(req, res, (err) => {
    if (err) {
      console.error('Invalid JSON', err);
      return res.status(400).json({ 
        message: 'Invalid JSON',
        success: false,
        data: null,
      });
    }
    next();
  });
});
app.use(cors({ origin: '*' }));
app.use(morgan("dev"));

//route 
app.use('/etemp', routes);
app.use(globalErrorHanlder);

app.listen(port, () => {
  initRedis();
  initQueue();
  socket.on('connect', () => console.log("Socket connected"));
  socket.on('disconnect', () => console.log("Socket disconnected"));
  console.log(`Start server in port ${port}`);
  console.log(process.env.NODE_ENV === 'production' ? 'Production mode' : 'Developer mode');
});