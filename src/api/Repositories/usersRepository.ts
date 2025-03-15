import type { User } from "@/models/user";
import { myApi } from "../myApi";



const url = '/user';
export default {

    get() {
        return myApi.get<User[]>(url);
    },

    getUser(userId: string) {
        return myApi.get<User>(`${url}/${userId}`);
    },

    post(user: User) {
        return myApi.post<User>(url, user);
    },

    put(user: User) {
        return myApi.put<User>(`${url}/${user.userId}`, user);
    },

    delete(userId: string) {
        return myApi.delete<User>(`${url}/${userId}`);
    },



}
