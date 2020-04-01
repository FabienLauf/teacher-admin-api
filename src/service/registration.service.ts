import {Student, Teacher, TeacherStudent} from "../model";
import {StudentDao, TeacherDao} from "../dao";

/**
 * 1. If the teacher doesn't exist, we create it, otherwise we get it.
 * 2. For each student, we check if it exists, if not we create it, oterwise we get it.
 * 3. We build instances of TeacherStudent for each teacher-student pair.
 * 4. We check if the pair already exists.
 * 5. We only add the pair that don't exist yet.
 */
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
                // Use a second Promise.all to filter asynchronously.
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