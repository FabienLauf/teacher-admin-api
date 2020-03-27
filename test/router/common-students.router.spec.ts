import {app} from "../server";
import supertest from "supertest";

const request = supertest(app);

describe("registrationRouter", () => {
    it("should NOT expose POST /commonstudents endpoint", async () => {
        const resp = await request.post("/api/commonstudents");

        expect(resp.status).toBe(404);
        expect(resp.body).toHaveProperty("message", "Resource not found");
        expect(resp.body).not.toHaveProperty("error");
    });

    it("should return HTTP 'Unprocessable Entity' for GET /commonstudents with invalid request", async () => {
        const resp = await request.get("/api/commonstudents");

        expect(resp.status).toBe(422);
        expect(resp.body).toHaveProperty("message", "Invalid request parameters");
        expect(resp.body).toHaveProperty("error", [
            {
                value: undefined,
                msg: 'Invalid value',
                param: 'teacher',
                location: 'body'
            }
        ]);
    });

    it("should return HTTP 'OK' for GET /commonstudents with valid request", async () => {
        const resp = await request.get("/api/commonstudents?teacher=teacherken%40gmail.com&teacher=teacherjoe%40gmail.com");

        expect(resp.status).toBe(200);
        expect(resp.body).toEqual({});
    });
});