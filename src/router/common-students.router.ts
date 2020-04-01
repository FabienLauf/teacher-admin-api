import express, {NextFunction, Request, Response} from "express";
import {Teacher} from "../model";
import HttpException from "../common/http-exception";
import {oneOf, query, validationResult} from "express-validator";
import {CommonStudentsService} from "../service"

export const commonStudentsRouter = express.Router();

commonStudentsRouter.get("/commonstudents", oneOf([
    query('teacher').isArray(),
    query('teacher').isEmail()
]),async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpException(422, "Invalid request parameters", errors.array()));
    }

    const teachers: Teacher[] = [];
    const reqTeacher = req.query.teacher;
    if(Array.isArray(reqTeacher)) reqTeacher.forEach(e => teachers.push({email:e}));
    else teachers.push({email: reqTeacher});

    return CommonStudentsService.retrieveStudents(teachers)
        .then(students => {
            const sEmails: string[] = students.map(s => s.email);
            res.status(200).json({students: sEmails});
        }).catch(e => {
            next(new HttpException(500, e.message));
        });
});