import multer from 'multer';
import path from 'path';
import { Request } from 'express';

const storage = multer.diskStorage({
  destination: 'public/files/',
  filename: (req: Request, file: any, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req: Request, file: any, cb: (error: Error | null, acceptFile: boolean) => void) => {
    const supportedFile = /jpg|jpeg|png|webp/;
    const extension = path.extname(file.originalname);

    if (supportedFile.test(extension)) {
      cb(null, true);
    } else {
      cb(new Error('Must be a jpg/png/jpeg/webp file'), false);
    }
  },
});

export default upload;
