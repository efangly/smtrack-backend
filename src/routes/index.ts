import type { Request, Response } from 'express';
import { Router } from 'express';
import notiRouter from './noti';
import logRouter from './log';
import configRouter from './config';

const router = Router();

router.use('/config', configRouter);
router.use('/notification', notiRouter);
router.use('/log', logRouter);
router.use('/', (_req: Request, res: Response) => {
  res.status(404).json({ 
    message: 'Not Found',
    success: false, 
    data: null
  });
});

export default router;
