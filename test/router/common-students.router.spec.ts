import {app} from "../../src/helper/server";
import supertest from "supertest";
import {CommonStudentsService} from "../../src/service";

const request = supertest(app);

describe("commonStudentsRouter", () => {
    beforeAll(() => {
        CommonStudentsService.retrieveStudents = jest.fn().mockResolvedValue([
            {email:"commonstudent1@gmail.com",suspended:false},
            {email:"commonstudent2@gmail.com",suspended:false}
        ]);
    });

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
        expect(resp.body).toHaveProperty("error",[
            {
                msg: "Invalid value(s)",
                nestedErrors: [
                    {
                        location: "query",
                        msg: "Invalid value",
                        param: "teacher",
                    },
                    {
                        location: "query",
                        msg: "Invalid value",
                        param: "teacher",
                    },
                ],
                param: "_error",
            }
        ]);
    });

    it("should return HTTP 'OK' for GET /commonstudents with teacher as array", async () => {
        const resp = await request.get("/api/commonstudents?teacher=teacherken%40gmail.com&teacher=teacherjoe%40gmail.com");

        expect(resp.status).toBe(200);
        expect(resp.body).toEqual({students: ["commonstudent1@gmail.com", "commonstudent2@gmail.com"]});
    });

    it("should return HTTP 'OK' for GET /commonstudents with teacher as unique email", async () => {
        const resp = await request.get("/api/commonstudents?teacher=teacherken%40gmail.com");

        expect(resp.status).toBe(200);
        expect(resp.body).toEqual({students: ["commonstudent1@gmail.com", "commonstudent2@gmail.com"]});
    });
});