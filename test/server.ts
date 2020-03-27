import express from "express";
import {registrationRouter} from "../src/router/registration.router";
import {teacherRouter} from "../src/router/teacher.router";
import {commonStudentsRouter} from "../src/router/common-students.router";
import {suspensionRouter} from "../src/router/suspension.router";
import {notificationRouter} from "../src/router/notification.router";
import {errorHandler} from "../src/middleware/error.middleware";
import {notFoundHandler} from "../src/middleware/not-found.middleware";

export const app = express();

app.use(express.json());
app.use("/api", [registrationRouter, teacherRouter, commonStudentsRouter, suspensionRouter, notificationRouter]);
app.use([errorHandler, notFoundHandler]);