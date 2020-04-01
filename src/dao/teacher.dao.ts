import {Teacher, TeacherStudent} from "../model";
import querySql from "../helper/db";

const tableName = "teachers";
const tsTableName = "teacher_students";
const emailField = "email";
const tIdField = "tId";
const sIdField = "sId";

export async function findAll() {
    return querySql("SELECT * FROM ??",
        [tableName]
    ).then(res => {
        return res as Teacher[];
    });
}

export async function findByEmail(email: string) {
    if(!email) return null as unknown as Teacher;

    return querySql("SELECT * FROM ?? WHERE ?? = ?",
        [tableName, emailField, email]
    ).then(res => {
        if(!res || res.length==0) return null;
        return res[0] as Teacher;
    });
}

export async function create(newTeacher: Teacher) {
    if(!newTeacher) return null as unknown as Teacher;

    return querySql("INSERT INTO ?? (??) VALUES (?)",
        [tableName, emailField, newTeacher.email]
    ).then(res => {
        if(res.affectedRows<1) throw new Error("Error creating teacher ["+newTeacher+"]");
        return {id:res.insertId, ...newTeacher} as Teacher;
    });
}

export async function isRegistered(teacherStudent: TeacherStudent) {
    if(!teacherStudent) return null as unknown as TeacherStudent;

    return querySql("SELECT ?? FROM ?? ts WHERE ?? = ? AND ?? = ?",
        [tIdField, tsTableName, tIdField, teacherStudent.tId, sIdField, teacherStudent.sId]
    ).then(res => {
        return res && res.length>0;
    });
}

export async function registerStudent(teacherStudents: TeacherStudent[]) {
    if(!teacherStudents || teacherStudents.length==0) return [] as TeacherStudent[];

    const values: number[][] = teacherStudents.map(ts => [ts.tId, ts.sId]);

    return querySql("INSERT INTO ?? (??,??) VALUES ?",
        [tsTableName, tIdField, sIdField, values]
    ).then(res => {
        if(res.affectedRows<1) throw new Error("Error creating teacherStudent ["+teacherStudents+"]");
        return res as TeacherStudent[];
    }).catch((err) => {
        throw err;
    });
}