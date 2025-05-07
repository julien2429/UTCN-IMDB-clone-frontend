import type { LoginRequest } from './../../models/loginRequest';
import type { User } from "@/models/user";
import { myApi } from "../apiBase";
import AddAReview from '@/components/ReviewComponents/AddAReview.vue';
import type { ReviewRequest } from '@/models/reviewRequest';



const url = '/user';
export const UserRepository = {

    get: () => {
        return myApi.get<User[]>(url);
    },

    getUser: (userId: string) => {
        return myApi.get<User>(`${url}/${userId}`);
    },

    post: (user: User) => {
        return myApi.post<User>(url, user);
    },

    put: (user: User) => {
        return myApi.put<User>(`${url}/${user.userId}`, user);
    },

    delete: (userId: string) => {
        return myApi.delete<User>(`${url}/${userId}`);
    },

    login: (loginRequest: LoginRequest) => {
        return myApi.post<User>(`${url}/login`, loginRequest);
    },

    AddAReview: (reviewRequest: ReviewRequest) =>
    {
        return myApi.post(`${url}/addReview`, reviewRequest);
    }

};
