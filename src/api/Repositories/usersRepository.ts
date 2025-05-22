import type { LoginRequest } from './../../models/loginRequest';
import type { User } from "@/models/user";
import { myApi } from "../apiBase";
import AddAReview from '@/components/ReviewComponents/AddAReview.vue';
import type { ReviewRequest } from '@/models/reviewRequest';
import type { ListResponseDTO } from '@/models/lists';



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
    },

    fetchUserLists: (userId: string) => {
        return myApi.get<ListResponseDTO[]>(`${url}/getAllLists/${userId}`);
    },

    fetchList: (userId: string, listId: string) => {
        return myApi.get<ListResponseDTO>(`${url}/getList/${userId}/${listId}`);
    },

    addToList: (userId: string, listId: string, movieId: string) => {
        return myApi.post<User>(`${url}/addMovieToList/${userId}/${listId}/${movieId}`);
    },

    removeFromList: (userId: string, listId: string, movieId: string) => {
        return myApi.post<User>(`${url}/removeMovieFromList/${userId}/${listId}/${movieId}`);
    },

    findMovieInLists: (userId: string, movieId: string) => {
        return myApi.get<String[]>(`${url}/findMovieInLists/${userId}/${movieId}`);
    }



};
