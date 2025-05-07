import type { LoginRequest } from '../../models/loginRequest';
import type { User } from "@/models/user";
import { myApi } from "../apiBase";

const url = '/auth';
export const AuthRepository = {

    login: (loginRequest: LoginRequest) => {
        return myApi.post<User>(`${url}/login`, loginRequest);
    },

    register: (user: User) => {
        return myApi.post<User>(`${url}/register`, user);
    },

    forgotPasswordSendEmail: (email: String) => {
        return myApi.post(`${url}/reset-password/${email}`);
    },

    resetPassword: (password: String, token: String, email: String) => {
        return myApi.post(`${url}/reset-password-confirmation`, {
            email: email,
            token: token,
            password: password
        });
        
    },

};
