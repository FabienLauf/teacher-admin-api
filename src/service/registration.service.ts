import {Teacher, Student, TeacherStudent} from "../model";
import {TeacherDao, StudentDao} from "../dao"

export async function register(teacher: Teacher, students: Student[]) {
    TeacherDao.create(teacher).then(tId => {
        students.forEach(s => {
            StudentDao.create(s).then(sId => {
                const teacherStudent = {tId: tId, sId: sId} as TeacherStudent;
                TeacherDao.registerStudent(teacherStudent);
            });
        });
    });
}