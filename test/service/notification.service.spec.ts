import {StudentDao} from "../../src/dao"
import {NotificationService} from "../../src/service";

describe("NotificationService", () => {
    beforeEach(() => {
        StudentDao.findAllNonSuspendedForTeacher = jest.fn();
    });

    it("should return empty recipients if the teacher has no students and no mentions in the message", async () => {
        // Given
        const tEmail = "teacherken@gmail.com";
        const notif = "Hello world!";
        const mock = jest.spyOn(StudentDao, 'findAllNonSuspendedForTeacher');
        mock.mockImplementation(() => Promise.resolve([]));

        // When
        return NotificationService.findRecipients({email:tEmail}, notif)
            .then(recipients => {
                expect(recipients).toBeDefined();
                expect(recipients).toHaveLength(0);
            });
    });

    it("should return only the students assigned to the teacher when there are no mentions in the message", async () => {
        // Given
        const tEmail = "teacherken@gmail.com";
        const sEmail1 = "studentjon@gmail.com";
        const sEmail2 = "studenthon@gmail.com";
        const students = [{email:sEmail1, suspended:false}, {email:sEmail2, suspended:false}];
        const notif = "Hello world!";
        const mock = jest.spyOn(StudentDao, 'findAllNonSuspendedForTeacher');
        mock.mockImplementation(() => Promise.resolve(students));
        const expected = students.map(s=>s.email);

        // When
        return NotificationService.findRecipients({email:tEmail}, notif)
            .then(recipients => {
                expect(recipients).toBeDefined();
                expect(recipients).toHaveLength(expected.length);
                expect(recipients).toEqual(expect.arrayContaining(expected));
            });
    });

    it("should return only the students mentioned in the message if the teacher has no students assigned to him", async () => {
        // Given
        const tEmail = "teacherken@gmail.com";
        const sEmail1 = "studentjon@gmail.com";
        const sEmail2 = "studenthon@gmail.com";
        const students = [{email:sEmail1, suspended:false}, {email:sEmail2, suspended:false}];
        const notif = "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com";
        const mock = jest.spyOn(StudentDao, 'findAllNonSuspendedForTeacher');
        mock.mockImplementation(() => Promise.resolve(students));
        const expected = students.map(s=>s.email).concat("studentagnes@gmail.com", "studentmiche@gmail.com");

        // When
        return NotificationService.findRecipients({email:tEmail}, notif)
            .then(recipients => {
                expect(recipients).toBeDefined();
                expect(recipients).toHaveLength(expected.length);
                expect(recipients).toEqual(expect.arrayContaining(expected));
            });
    });
});