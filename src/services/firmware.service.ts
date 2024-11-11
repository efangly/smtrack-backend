import { format } from "date-fns";
import fs from "node:fs"
import path from "node:path";

const addFirmware = (file: Express.Multer.File) => {
  try {
    const fileSize = file.size * 0.000001
    return {
      name: file.filename,
      size: `${fileSize.toFixed(2)}MB`
    }
  } catch (error) {
    throw error;
  }
}

const firmwareList = () => {
  try {
    const directoryPath = 'public/firmwares';
    const filesAndFolders = fs.readdirSync(directoryPath);
    const file = filesAndFolders.filter((item) => item !== ".DS_Store").map((item) => {
      const itemPath = path.join(directoryPath, item);
      const stats = fs.statSync(itemPath);
      return {
        fileName: item,
        fileSize: `${(stats.size * 0.000001).toFixed(2)}MB`,
        createDate: format(stats.birthtime, "yyyy-MM-dd' 'HH:mm:ss")
      };
    });
    return file;
  } catch (error) {
    throw error;
  }
}

const removeFirmware = (filename: string): string => {
  try {
    fs.unlinkSync(path.join('public/firmwares', filename));
    return `Delete ${filename} success`;
  } catch (error) {
    throw error;
  }
}

export {
  firmwareList,
  addFirmware,
  removeFirmware
}