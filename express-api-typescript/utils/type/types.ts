import { Request } from "express";

export interface IRequestFile extends Request {
    file?: any;
    files?: any;
}

export type IErrorMessage = {
    path: string | number;
    message: string;
};

export type IErrorResponse = {
    statusCode: number;
    message: string;
    errorMessages: IErrorMessage[];
};

export interface IApiReponse<T> {
    statusCode: number;
    success: boolean;
    message?: string | null;
    meta?: {
        page?: number;
        limit?: number;
        showingTotal?: number;
        total: number;
    };
    data?: T | null;
};
