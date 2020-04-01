import {Teacher} from "../model";
import {StudentDao} from "../dao";

export async function retrieveStudents(teachers: Teacher[]) {
    return StudentDao.findAllRegisteredToTeachers(teachers)
        .catch(() => {
            throw new Error("Error while retrieving common students of teachers");
        });
}