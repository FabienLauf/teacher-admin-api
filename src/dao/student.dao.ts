import querySql from "../helper/db";
import {Student, Teacher} from "../model";

const sTableName = "students";
const tTableName = "teachers";
const tsTableName = "teacher_students";
const sIdField = "s.id";
const sEmailField = "email";
const suspendedField = "s.suspended";
const tIdField = "t.id";
const tEmailField = "t.email";
const tsSIdField = "ts.sId";
const tsTIdField = "ts.tId";

export async function findAll() {
    return querySql("SELECT * FROM ??",
        [sTableName]
    ).then(res => {
        return res as Student[];
    });
}

export async function findByEmail(email: string) {
    if(!email) return null as unknown as Student;

    return querySql("SELECT * FROM ?? s WHERE ?? = ?", [sTableName, sEmailField, email])
        .then(res => {
            if(!res || res.length==0) return null;
            return res[0] as Student;
        });
}

export async function create(newStudent: Student) {
    if(!newStudent) return null as unknown as Student;

    return querySql("INSERT INTO ?? (??) VALUES (?)",
        [sTableName, sEmailField, newStudent.email]
    ).then(res => {
        if(res.affectedRows<1) throw new Error("Error creating student ["+newStudent+"]");
        return {id:res.insertId, ...newStudent} as Student;
    });
}

export async function suspend(email: string) {
    if(!email) return null;

    return querySql("UPDATE ?? s SET ?? = true WHERE ?? = ?",
        [sTableName, suspendedField, sEmailField, email]
    ).then(res => {
        if(res.affectedRows<1) return "This student ["+email+"] is not registered";
        return "Student ["+email+"] is now Suspended";
    });
}

export async function findAllRegisteredToTeachers(teachers: Teacher[]) {
    if(!teachers || teachers.length==0) return [] as Student[];

    const emails = teachers.map(t => t.email);
    return querySql("SELECT s.* FROM ?? s\n" +
        "WHERE ?? IN (\n" +
        "    SELECT ??\n" +
        "    FROM ?? ts\n" +
        "    INNER JOIN ?? t on ?? = ??\n" +
        "    WHERE ?? IN (?)\n" +
        "    GROUP BY ??\n" +
        "    HAVING COUNT(DISTINCT ??) = ?\n" +
        ")",
[sTableName, sIdField, tsSIdField, tsTableName, tTableName, tsTIdField, tIdField, tEmailField, emails, tsSIdField, tsTIdField, emails.length]
    ).then(res => {
        return res as Student[];
    });
}

export async function findAllNonSuspendedForTeacher(teacher: Teacher) {
    if(!teacher) return [] as Student[];

    return querySql("SELECT s.* FROM ?? s\n" +
        "INNER JOIN ?? ts ON ?? = ??\n" +
        "INNER JOIN ?? t ON ?? = ??\n" +
        "WHERE ?? = false AND ?? = ?",
        [sTableName, tsTableName, sIdField, tsSIdField, tTableName, tsTIdField, tIdField, suspendedField, tEmailField, teacher.email])
        .then(res => {
            return res as Student[];
        });
}