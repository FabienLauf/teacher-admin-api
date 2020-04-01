import {Teacher} from "../model";
import {StudentDao} from "../dao";

export async function findRecipients(teacher: Teacher, notification: string) {
    const emailRegexp = new RegExp("@([a-z0-9_.\\-]+@[a-z0-9_.\\-]+?\\.[a-zA-Z]{2,4})", "gmi");
    const emailsInNotif: string[] = [];
    let match;
    do {
        match = emailRegexp.exec(notification);
        if (match && match.length>=1) {
            emailsInNotif.push(match[1]);
        }
    } while (match);

    return StudentDao.findAllNonSuspendedForTeacher(teacher)
        .then(students => {
            return students.map(s => s.email).concat(emailsInNotif);
        })
        .catch(() => {
            throw new Error("Error while finding students to notify");
        });
}