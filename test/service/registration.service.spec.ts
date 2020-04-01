import {Student, Teacher} from "../../src/model";
import {StudentDao, TeacherDao} from "../../src/dao";
import {RegistrationService} from "../../src/service";

describe("RegistrationService", () => {
    beforeEach(() => {
        TeacherDao.findByEmail = jest.fn();
        TeacherDao.findAll = jest.fn();
        TeacherDao.create = jest.fn();
        TeacherDao.isRegistered = jest.fn().mockResolvedValue(false);
        TeacherDao.registerStudent = jest.fn().mockResolvedValue(null);
        StudentDao.findByEmail = jest.fn();
        StudentDao.suspend = jest.fn();
        StudentDao.create = jest.fn();
    });

    it("should create a new teacher if can't find the one passed as parameter", () => {
        // Given
        const email = "teacherken@gmail.com";
        TeacherDao.findByEmail = jest.fn().mockResolvedValue(null as unknown as Teacher);
        const spy = jest.spyOn(TeacherDao, 'create');
        spy.mockResolvedValue({id:1, email:email} as Teacher);

        // When
        const teacher: Teacher = {email:email};
        return RegistrationService.register(teacher, []).then(() => {
            //Then
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });

    it("should create new students if can't find the ones passed as parameter", () => {
        // Given
        const teacher: Teacher = {id:1, email:"teacherken@gmail.com"};
        TeacherDao.findByEmail = jest.fn().mockResolvedValue(teacher);
        const spyT = jest.spyOn(TeacherDao, 'create');
        const student: Student = {id:1, email:"studentjon@gmail.com", suspended:false};
        StudentDao.findByEmail = jest.fn().mockResolvedValue(null as unknown as Student);
        const spyS = jest.spyOn(StudentDao, 'create');
        spyS.mockResolvedValue(student);

        // When
        return RegistrationService.register(teacher, [student]).then(() => {
            //Then
            expect(spyT).toHaveBeenCalledTimes(0);
            expect(spyS).toHaveBeenCalledTimes(1);
        });
    });

    it("should create a new TeacherStudent with the ids of the teacher and students passed as parameter", () => {
        // Given
        const teacher: Teacher = {id:1, email:"teacherken@gmail.com"};
        TeacherDao.findByEmail = jest.fn().mockResolvedValue(teacher);
        const student: Student = {id:1, email:"studentjon@gmail.com", suspended:false};
        StudentDao.findByEmail = jest.fn().mockResolvedValue(student);
        const spy = jest.spyOn(TeacherDao, 'registerStudent');
        spy.mockResolvedValue([{id:10,tId:1,sId:1}]);

        // When
        return RegistrationService.register(teacher, [student]).then(() => {
            //Then
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith([{tId:1,sId:1}]);
        });
    });

    it("should create a new TeacherStudent from students who are NOT already registered to this teacher", () => {
        // Given
        const teacher: Teacher = {id:1, email:"teacherken@gmail.com"};
        TeacherDao.findByEmail = jest.fn().mockResolvedValue(teacher);
        const student1: Student = {id:1, email:"studentjon@gmail.com", suspended:false};
        const student2: Student = {id:2, email:"studenthon@gmail.com", suspended:false};
        StudentDao.findByEmail = jest.fn().mockResolvedValue(student1);
        StudentDao.create = jest.fn().mockResolvedValue(student2);
        TeacherDao.isRegistered = jest.fn().mockReturnValueOnce(true);
        const spy = jest.spyOn(TeacherDao, 'registerStudent');
        spy.mockResolvedValue([{id:10,tId:1,sId:2}]);

        // When
        return RegistrationService.register(teacher, [student1, student2]).then(() => {
            //Then
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith([{tId:1,sId:1}]);
        });
    });
});