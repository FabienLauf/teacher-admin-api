import HttpException from "../common/http-exception";
import { Request, Response, NextFunction } from "express";

export function errorHandler(ex: HttpException, req: Request, res: Response, next: NextFunction) {
    const status = ex.statusCode || 500;
    const message = ex.message || "Sorry, an unexpected error has been thrown.";
    const body = {
        message: message,
        error: ex.error
    };
    res.status(status).json(body);
}