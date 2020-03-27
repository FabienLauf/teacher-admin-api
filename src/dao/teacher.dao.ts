import {Teacher, TeacherStudent} from "../model";

const teachers: Teacher[] = [
];

const teacher_student: TeacherStudent[] = [
];

export async function findAll() {
    return teachers;
}
export async function findByEmail(email: string) {
    return teachers.find(t => t.email===email);
}
export async function create(newTeacher: Teacher) {
    const id = new Date().valueOf();
    newTeacher.id = id;
    teachers.push(newTeacher);
    return id;
}
export async function registerStudent(teacherStudent: TeacherStudent) {
    teacher_student.push(teacherStudent);
}