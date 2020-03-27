import express, {NextFunction, Request, Response} from "express";
import {TeacherDao} from "../dao"
import {Teacher} from "../model";
import HttpException from "../common/http-exception";

/**
 * Router Definition
 */
export const teacherRouter = express.Router();

/**
 * Controller Definitions
 */

// POST /api/register
teacherRouter.get("/teachers/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teachers: Teacher[] = await TeacherDao.findAll();

        res.status(200).json(teachers);
    } catch (e) {
        next(new HttpException(500, e.message, e));
    }
});