import express from "express";
import {registrationRouter} from "../router/registration.router";
import {teacherRouter} from "../router/teacher.router";
import {studentRouter} from "../router/student.router";
import {commonStudentsRouter} from "../router/common-students.router";
import {suspensionRouter} from "../router/suspension.router";
import {notificationRouter} from "../router/notification.router";
import {errorHandler} from "../middleware/error.middleware";
import {notFoundHandler} from "../middleware/not-found.middleware";

export const app = express();

app.use(express.json());
app.use("/api", [registrationRouter, teacherRouter, studentRouter, commonStudentsRouter, suspensionRouter, notificationRouter]);
app.use([errorHandler, notFoundHandler]);