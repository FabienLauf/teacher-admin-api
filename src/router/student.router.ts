import express, {NextFunction, Request, Response} from "express";
import {StudentDao} from "../dao"
import HttpException from "../common/http-exception";

export const studentRouter = express.Router();

studentRouter.get("/students/", async (req: Request, res: Response, next: NextFunction) => {
    return StudentDao.findAll()
        .then(students => {
            res.status(200).json(students);
        }).catch(e => {
            next(new HttpException(500, e.message, e));
        });
});