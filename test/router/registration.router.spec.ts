import {app} from "../server";
import supertest from "supertest";

const request = supertest(app);

describe("registrationRouter", () => {
    it("should NOT expose GET /register endpoint", async () => {
        const resp = await request.get("/api/register");

        expect(resp.status).toBe(404);
        expect(resp.body).toHaveProperty("message", "Resource not found");
        expect(resp.body).not.toHaveProperty("error");
    });

    it("should return HTTP 'Unprocessable Entity' for POST /register with invalid request", async () => {
        const resp = await request.post("/api/register");

        expect(resp.status).toBe(422);
        expect(resp.body).toHaveProperty("message", "Invalid request parameters");
        expect(resp.body).toHaveProperty("error", [
            {
                value: undefined,
                msg: 'Invalid value',
                param: 'teacher',
                location: 'body'
            },
            {
                value: undefined,
                msg: 'Invalid value',
                param: 'students',
                location: 'body'
            }
        ]);
    });

    it("should return HTTP 'No Content' for POST /register with valid request", async () => {
        const resp = await request.post("/api/register")
            .send({
                teacher: "teacherken@gmail.com",
                students: [
                    "studentjon@gmail.com",
                    "studenthon@gmail.com"
                ]
            });

        expect(resp.status).toBe(204);
        expect(resp.body).toEqual({});
    });
});