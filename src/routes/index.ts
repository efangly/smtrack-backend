import type { Request, Response } from 'express';
import express, { Router } from 'express';
import authRouter from './auth';
import userRouter from './user';
import deviceRouter from './device';
import hospitalRouter from './hospital';
import wardRouter from './ward';
import probeRouter from './probe';
import repairRouter from './repair';
import warrantyRouter from './warranty';
import notiRouter from './noti';
import logRouter from './log';
import configRouter from './config';
import firmwareRouter from './firmware';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import YAML from 'yaml';
import utilsRouter from './utils';
import { verifyToken } from '../middlewares';

const file = fs.readFileSync("./swagger.yaml", "utf8");
const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/device', deviceRouter);
router.use('/config', configRouter);
router.use('/hospital', hospitalRouter);
router.use('/ward', wardRouter);
router.use('/probe', probeRouter);
router.use('/repair', repairRouter);
router.use('/warranty', warrantyRouter);
router.use('/notification', notiRouter);
router.use('/log', logRouter);
router.use('/firmwares', firmwareRouter);
router.use('/img', express.static('public/images'));
router.use('/font', express.static('public/fonts'));
router.use('/media', express.static('public/medias'));
router.use('/firmware', express.static('public/firmwares'));
router.use('/logs', verifyToken, express.static('public/logs'));
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(YAML.parse(file)));
router.use('/utils', utilsRouter);
router.use('/', (_req: Request, res: Response) => {
  res.status(404).json({ 
    message: 'Not Found',
    success: false, 
    data: null
  });
});

export default router;