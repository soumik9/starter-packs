import { Request, RequestHandler, Response } from "express";
import bcrypt from 'bcrypt';

import User from "../../models/userSchema";
import httpStatus from "http-status";
import sendResponse from "../../../utils/helpers/SendResponse";
import catchAsync from "../../../utils/helpers/catchAsync";
import ApiError from "../../../utils/errors/ApiError";
import { IUser } from "../../interfaces/UserInterface";
import generateToken from "../../../utils/helpers/jwt/generateToken";

const signin: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {

        // checking email and password given
        if (!req.body.email || !req.body.password) throw new ApiError(httpStatus.BAD_REQUEST, 'Information mismatched!');

        // find user
        const user = await User.findOne({ email: req.body.email }).lean();
        if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'Information mismatched!');

        // checking is valid password
        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPassword) throw new ApiError(httpStatus.UNAUTHORIZED, 'Credential mismatch!');

        // token
        const token = generateToken(user, req.body.rememberMe);

        // user data
        const { password, confirmPassword, ...pwd } = user;

        sendResponse<{ accessToken: any; user: Partial<IUser>; }>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Login Success!',
            data: {
                accessToken: token,
                user: pwd
            },
        });
    }
)

export default signin