import express, {NextFunction, Request, Response} from "express";
import {Teacher, Student} from "../model";
import HttpException from "../common/http-exception";
import {check, validationResult} from "express-validator";

export const suspensionRouter = express.Router();

suspensionRouter.post("/suspend", [
    check('student').isEmail()
], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpException(422, "Invalid request parameters", errors.array()));
        }

        const students: Student = req.body.student;

        res.sendStatus(204);
    } catch (e) {
        next(new HttpException(500, e.message, e));
    }
});