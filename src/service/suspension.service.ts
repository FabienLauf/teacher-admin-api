import {StudentDao} from "../dao";

export async function suspend(email: string) {
    return StudentDao.suspend(email)
        .catch(() => {
            throw new Error("Error while suspending a student");
        });
}