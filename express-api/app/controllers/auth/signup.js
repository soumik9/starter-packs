import User from "../../models/userSchema.js";
import httpStatus from "http-status";
import sendResponse from "../../../utils/helpers/SendResponse.js";
import catchAsync from "../../../utils/helpers/catchAsync.js";
import ApiError from "../../../utils/errors/ApiError.js";

const signup = catchAsync(
    async (req, res) => {

        // finding user if exists
        const user = await User.findOne({ email: req.body.email });
        if (user) throw new ApiError(httpStatus.BAD_REQUEST, 'Account already exists!');

        // creating user
        await User.create(req.body);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: `User (${data.name}) created successfully!`,
        });
    }
)

export default signup