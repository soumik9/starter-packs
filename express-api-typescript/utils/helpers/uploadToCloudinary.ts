import { ICloudinaryResponse, IUploadFile } from "../type/file";
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import config from "../server/config";

cloudinary.config({
    cloud_name: config.CLOUD_NAME,
    api_key: config.CLOUD_API_KEY,
    api_secret: config.CLOUD_API_SECRET
});

const uploadToCloudinary = async (file: IUploadFile): Promise<ICloudinaryResponse | undefined> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path,
            (error: Error, result: ICloudinaryResponse) => {
                fs.unlinkSync(file.path);
                if (error) {
                    reject(error)
                }
                else {
                    resolve(result)
                }
            })
    })
};

export default uploadToCloudinary