import express from "express";
import {
    commonStudentsRouter,
    errorHandler,
    notFoundHandler,
    notificationRouter,
    registrationRouter,
    studentRouter,
    suspensionRouter,
    teacherRouter
} from "../router";

// Centralising the app definition here, so it can be shared with the unit tests as well.

export const app = express();

app.use(express.json());
app.use("/api", [registrationRouter, teacherRouter, studentRouter, commonStudentsRouter, suspensionRouter, notificationRouter]);
app.use([errorHandler, notFoundHandler]);