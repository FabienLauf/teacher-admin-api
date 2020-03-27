import {app} from "../server";
import supertest from "supertest";

const request = supertest(app);

describe("suspensionRouter", () => {
    it("should NOT expose GET /suspend endpoint", async () => {
        const resp = await request.get("/api/suspend");

        expect(resp.status).toBe(404);
        expect(resp.body).toHaveProperty("message", "Resource not found");
        expect(resp.body).not.toHaveProperty("error");
    });

    it("should return HTTP 'Unprocessable Entity' for POST /suspend with invalid request", async () => {
        const resp = await request.post("/api/suspend");

        expect(resp.status).toBe(422);
        expect(resp.body).toHaveProperty("message", "Invalid request parameters");
        expect(resp.body).toHaveProperty("error", [
            {
                value: undefined,
                msg: 'Invalid value',
                param: 'student',
                location: 'body'
            }
        ]);
    });

    it("should return HTTP 'No Content' for POST /suspend with valid request", async () => {
        const resp = await request.post("/api/suspend")
            .send({
                student : "studentmary@gmail.com"
            });

        expect(resp.status).toBe(204);
        expect(resp.body).toEqual({});
    });
});