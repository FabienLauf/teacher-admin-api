import {app} from "../server";
import supertest from "supertest";

const request = supertest(app);

describe("registrationRouter", () => {
    it("should NOT expose GET /retrievefornotifications endpoint", async () => {
        const resp = await request.get("/api/retrievefornotifications");

        expect(resp.status).toBe(404);
        expect(resp.body).toHaveProperty("message", "Resource not found");
        expect(resp.body).not.toHaveProperty("error");
    });

    it("should return HTTP 'Unprocessable Entity' for POST /retrievefornotifications with invalid request", async () => {
        const resp = await request.post("/api/retrievefornotifications");

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
                param: 'notification',
                location: 'body'
            }
        ]);
    });

    it("should return HTTP 'OK' for POST /retrievefornotifications with valid request", async () => {
        const resp = await request.post("/api/retrievefornotifications")
            .send({
                teacher: "teacherken@gmail.com",
                notification: "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
            });

        expect(resp.status).toBe(200);
        expect(resp.body).toEqual({});
    });
});