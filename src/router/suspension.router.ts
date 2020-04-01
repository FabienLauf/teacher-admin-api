import express, {NextFunction, Request, Response} from "express";
import HttpException from "../common/http-exception";
import {check, validationResult} from "express-validator";
import {SuspensionService} from "../service";

export const suspensionRouter = express.Router();

suspensionRouter.post("/suspend", [
    check('student').isEmail()
], async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpException(422, "Invalid request parameters", errors.array()));
    }

    const email: string = req.body.student;

    return SuspensionService.suspend(email)
        .then(() => {
            res.sendStatus(204);
        }).catch(e => {
            next(new HttpException(500, e.message, e));
        });
});