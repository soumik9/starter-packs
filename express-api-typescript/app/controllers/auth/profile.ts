import { Request, RequestHandler, Response } from "express";
import User from "../../models/userSchema";
import catchAsync from "../../../utils/helpers/catchAsync";
import { IUser } from "../../interfaces/UserInterface";
import httpStatus from "http-status";
import sendResponse from "../../../utils/helpers/SendResponse";

const profile: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {

        // finding profile data
        const result = await User.findById(req.user?._id).select("-password");

        sendResponse<IUser>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Profile retrieved successfully!',
            data: result,
        });
    }
)

export default profile