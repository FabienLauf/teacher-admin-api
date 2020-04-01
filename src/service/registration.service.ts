import {Student, Teacher, TeacherStudent} from "../model";
import {StudentDao, TeacherDao} from "../dao";

export async function register(teacher: Teacher, students: Student[]) {
    return TeacherDao.findByEmail(teacher.email)
        .then(t => {
            if(!t || !t.id) return TeacherDao.create(teacher);
            else return t;
        })
        .then(t => {
            if(!t || !t.id) throw new Error("No teacher received");

            const promises = students.map(s => {
                return StudentDao.findByEmail(s.email)
                        .then(sFound => {
                            if(!sFound || !sFound.id) return StudentDao.create(s);
                            else return sFound;
                        }).then(sFound => {
                            if(!t || !t.id || !sFound || !sFound.id) throw new Error("No teacher or students received");
                            return {tId:t.id, sId:sFound.id} as TeacherStudent;
                        });
            });

            // Filter the students already registered to each teacher, so we register only the new ones.
            return Promise.all(promises).then((ts: TeacherStudent[]) => {
                return Promise.all(ts.map((elem) => TeacherDao.isRegistered(elem)))
                    .then(result => {
                        return ts.filter((element, index) => {
                            return !result[index];
                        });
                    }).then((toInsert: TeacherStudent[]) => {
                        return TeacherDao.registerStudent(toInsert);
                    });
            });
        })
        .catch(() => {
            throw new Error("Error while registering students to a teacher");
        });
}