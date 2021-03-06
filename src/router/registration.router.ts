import express, {NextFunction, Request, Response} from "express";
import {RegistrationService} from "../service"
import {Student, Teacher} from "../model";
import HttpException from "../common/http-exception";
import {check, validationResult} from "express-validator";

export const registrationRouter = express.Router();

registrationRouter.post("/register", [
    check('teacher').isEmail(),
    check('students').isArray()
], async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpException(422, "Invalid request parameters", errors.array()));
    }

    const teacher: Teacher = {email: req.body.teacher};
    const studentsEmails: string[] = req.body.students;
    const students: Student[] = studentsEmails.map(s => {return {email:s} as Student;});

    return RegistrationService.register(teacher, students)
        .then(()=>{
            res.sendStatus(204);
        })
        .catch(e => {
            next(new HttpException(500, e.message));
        });
});