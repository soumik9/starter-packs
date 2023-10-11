import { RequestHandler, Response } from "express";
import User from "../../models/userSchema";
import { IRequestFile } from "../../../utils/type/types";
import httpStatus from "http-status";
import sendResponse from "../../../utils/helpers/SendResponse";
import catchAsync from "../../../utils/helpers/catchAsync";
import ApiError from "../../../utils/errors/ApiError";
import mongoose from "mongoose";
import { IUploadFile } from "../../../utils/type/file";
import uploadToCloudinary from "../../../utils/helpers/uploadToCloudinary";

const signup: RequestHandler = catchAsync(
    async (req: IRequestFile, res: Response) => {

        let body = JSON.parse(req.body.data);
        const email = body.email;
        const username = body.username;
        const password = body.password;

        // finding user if exists
        const user = await User.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        });

        if (user) throw new ApiError(httpStatus.BAD_REQUEST, 'Account already exists!');

        // if there is password and confirm password
        if (password !== body.confirmPassword) throw new ApiError(httpStatus.BAD_REQUEST, 'Password mismatch!');

        // uploading file
        if (req.file) {
            const file = req.file as IUploadFile;
            const uploadedImage = await uploadToCloudinary(file);

            if (!uploadedImage?.secure_url) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to upload image!');
            } else {
                body.image = uploadedImage.secure_url
            }
        } else {
            body.image = `https://ui-avatars.com/api/?name=${body.name}`;
        }


        // if the everything ok, process the transaction here
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            // 1. saving user with image url
            const newUser = await User.create(
                [body],
                { session: session }
            );

            // commit and end the transaction
            await session.commitTransaction();
            await session.endSession();

            sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: `User (${body.name}) created successfully!`,
            });

        } catch (error) {
            // if any error occurs, abort the transaction and handle the error
            await session.abortTransaction();
            await session.endSession();
            console.error("Transaction error:", error);
            throw error;
        }
    }
)

export default signup