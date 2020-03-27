import express, {NextFunction, Request, Response} from "express";
import {Student, Teacher} from "../model";
import HttpException from "../common/http-exception";
import {check, validationResult} from "express-validator";

export const commonStudentsRouter = express.Router();

commonStudentsRouter.get("/commonstudents", [
    check('teacher').isArray()
], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpException(422, "Invalid request parameters", errors.array()));
        }

        const teacher: Teacher[] = req.body.teacher;

        res.sendStatus(200);
    } catch (e) {
        next(new HttpException(500, e.message, e));
    }
});