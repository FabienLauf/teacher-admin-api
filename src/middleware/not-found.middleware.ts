import {NextFunction, Request, Response} from "express";

/**
 * Common Handler for 404 responses.
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
    res.status(404).send({message: "Resource not found"});
}