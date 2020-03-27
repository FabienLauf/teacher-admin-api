import {Student} from "../model";

const students: Student[] = [
];

export async function findByEmail(email: string) {
    return students.find(s => s.email===email);
}
export async function create(newStudent: Student) {
    const id = new Date().valueOf();
    newStudent.id = id;
    students.push(newStudent);
    return id;
}