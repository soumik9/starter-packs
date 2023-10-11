import { NextFunction, Request, Response } from "express";
import { Secret } from 'jsonwebtoken'
import ApiError from "../../utils/errors/ApiError";
import httpStatus from "http-status";
import verifyToken from "../../utils/helpers/jwt/verifyToken";

export default (...requiredRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');

        // getting token
        const token = authHeader.split(' ')[1];

        // verify token
        let verifiedUser = null;
        verifiedUser = verifyToken(token, process.env.TOKEN_SECRET as Secret);
        req.user = verifiedUser; // role  , userid

        // role diye guard korar jnno
        if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
            throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
        }

        next();
    } catch (error) {
        next(error);
    }
}