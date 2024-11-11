import path from "node:path";
import fs from "node:fs"
import { Request } from 'express'
import multer, { diskStorage, FileFilterCallback, Multer, StorageEngine  } from "multer";

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage: StorageEngine = diskStorage({
  destination: (req: Request, file: Express.Multer.File, callback: DestinationCallback): void => {
    let pathname: string = 'public/medias';
    if (!fs.existsSync(pathname)) fs.mkdirSync(pathname, { recursive: true });
    callback(null, path.join(pathname));
  },
  filename: (req: Request, file: Express.Multer.File, callback: FileNameCallback): void => {
    let extArr: string[] = file.originalname.split('.');
    let ext: string = extArr[extArr.length-1];
    callback(null, file.originalname);
  }
});
export const uploadMedia: Multer = multer({ 
  storage: storage,
  fileFilter: (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    callback(null, true);
  }
});