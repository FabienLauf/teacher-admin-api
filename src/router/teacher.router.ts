import express, {NextFunction, Request, Response} from "express";
import {TeacherDao} from "../dao"
import HttpException from "../common/http-exception";

export const teacherRouter = express.Router();

teacherRouter.get("/teachers/", async (req: Request, res: Response, next: NextFunction) => {
    return TeacherDao.findAll()
        .then(teachers => {
            res.status(200).json(teachers);
        }).catch(e => {
            next(new HttpException(500, e.message, e));
        });
});