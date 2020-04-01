import express, {NextFunction, Request, Response} from "express";
import {Teacher} from "../model";
import HttpException from "../common/http-exception";
import {check, validationResult} from "express-validator";
import {NotificationService} from "../service";

export const notificationRouter = express.Router();

notificationRouter.post("/retrievefornotifications", [
    check('teacher').isEmail(),
    check('notification').isString()
],async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpException(422, "Invalid request parameters", errors.array()));
    }

    const teacher: Teacher = {email: req.body.teacher};
    const notification: string = req.body.notification;

    return NotificationService.findRecipients(teacher, notification)
        .then(recipients => {
            res.status(200).json({recipients: recipients});
        })
        .catch(e => {
            next(new HttpException(500, e.message));
        });
});